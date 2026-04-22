/**
 * Cloudflare Worker entry
 * -----------------------------------------------------------------------------
 * Routes:
 *
 *   GET  /config        — returns the public-safe API key + client key the
 *                         browser SDK needs to boot the checkout component.
 *
 *   POST /payments      — server-side proxy to the ConvesioPay payments API.
 *                         On success/pending, signs a JWT with the payment
 *                         details and injects a `redirectUrl` pointing at
 *                         `/thank-you?token=<jwt>`.
 *
 *   POST /verify-token  — verifies a thank-you redirect JWT and returns its
 *                         decoded payload. Used by the thank-you page on load.
 *
 *   POST /poll-payment  — proxies `GET /v1/payments/:id` upstream so the
 *                         thank-you page can poll for the latest status of
 *                         a pending payment every few seconds.
 *
 * Secrets are sourced from the Worker environment:
 *   CPAY_API_KEY, CPAY_CLIENT_KEY, CPAY_SECRET, CPAY_INTEGRATION
 *   CPAY_ENVIRONMENT (plain var; defaults to "test")
 *
 * `CPAY_ENVIRONMENT` also selects the upstream host: sandbox secrets must hit
 * the sandbox host and vice-versa, otherwise the API returns 401.
 * -----------------------------------------------------------------------------
 */

import { signCheckoutToken, verifyCheckoutToken } from './jwt';

/**
 * ConvesioPay uses separate sandboxes for test vs live. Sandbox API keys are
 * rejected by the live API (and vice-versa) with a 401 "Invalid authentication
 * token" — exactly the error we hit when the worker was unconditionally
 * pointing at the live host while the component was created with
 * `environment: "test"`.
 *
 * The matching hostnames mirror the dashboard split:
 *   live   → https://api.convesiopay.com
 *   test   → https://api.dev.convesiopay.com
 */
const CPAY_API_HOSTS = {
  live: 'https://api.convesiopay.com',
  test: 'https://api-qa.convesiopay.com',
} as const;

function paymentsEndpoint(environment: 'test' | 'live'): string {
  return `${CPAY_API_HOSTS[environment]}/v1/payments`;
}

function singlePaymentEndpoint(
  environment: 'test' | 'live',
  paymentId: string,
): string {
  return `${CPAY_API_HOSTS[environment]}/v1/payments/${encodeURIComponent(paymentId)}`;
}

function resolveEnvironment(env: Env): 'test' | 'live' {
  return env.CPAY_ENVIRONMENT === 'live' ? 'live' : 'test';
}

/**
 * Mirrors the client-side `SUCCESS_STATUSES` / `PENDING_STATUSES` sets in
 * `src/hooks/useCheckoutPayment.ts`. Kept duplicated here (rather than imported)
 * because the worker and SPA compile as separate bundles.
 */
const SUCCESS_STATUSES = new Set(['Succeeded', 'Authorized']);
const PENDING_STATUSES = new Set(['Pending']);

interface PaymentRequestBody {
  paymentToken: string;
  email: string;
  name: string;
  amount: number;
  currency: string;
  orderNumber?: string;
  returnUrl?: string;
  phone?: { number: string; countryCode: string };
  billingAddress?: Record<string, unknown>;
  shippingAddress?: Record<string, unknown>;
  lineItems?: Array<Record<string, unknown>>;
  captureMethod?: 'automatic' | 'manual';
  storePaymentMethod?: boolean;
}

const REQUIRED_FIELDS: Array<keyof PaymentRequestBody> = [
  'paymentToken',
  'email',
  'name',
  'amount',
  'currency',
];

interface UpstreamPaymentResponse {
  id?: string;
  orderNumber?: string;
  status?: string;
  customerId?: string;
  customer?: { id?: string };
  error?: boolean;
  message?: string;
  [key: string]: unknown;
}

function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...init.headers,
    },
  });
}

async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

function requireSecret(env: Env): Response | string {
  // Trimmed defensively — when secrets come in via `.env` on Windows /
  // some editors, stray `\r` / whitespace gets appended and CP rejects
  // the header with "Invalid authentication token".
  const secret = env.CPAY_SECRET?.trim();
  if (!secret) {
    return json(
      {
        error: true,
        message:
          'Worker is missing CPAY_SECRET. Set it via `wrangler secret put` or your `.env` / `.dev.vars`.',
      },
      { status: 500 },
    );
  }
  return secret;
}

function requireClientKey(env: Env): Response | string {
  const clientKey = env.CPAY_CLIENT_KEY?.trim();
  if (!clientKey) {
    return json(
      {
        error: true,
        message:
          'Worker is missing CPAY_CLIENT_KEY. Set it via `wrangler secret put` or your `.env` / `.dev.vars`.',
      },
      { status: 500 },
    );
  }
  return clientKey;
}

async function handleConfig(env: Env): Promise<Response> {
  return json({
    apiKey: env.CPAY_API_KEY,
    clientKey: env.CPAY_CLIENT_KEY,
    environment: env.CPAY_ENVIRONMENT ?? 'test',
  });
}

async function handlePayments(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readJson<PaymentRequestBody>(request);
  if (!body) {
    return json({ error: true, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const missing = REQUIRED_FIELDS.filter((key) => {
    const value = body[key];
    return value === undefined || value === null || value === '';
  });
  if (missing.length > 0) {
    return json(
      { error: true, message: `Missing required field(s): ${missing.join(', ')}` },
      { status: 400 },
    );
  }

  const secret = requireSecret(env);
  if (secret instanceof Response) return secret;

  const clientKey = requireClientKey(env);
  if (clientKey instanceof Response) return clientKey;

  const environment = resolveEnvironment(env);

  const payload = {
    ...body,
    integration: env.CPAY_INTEGRATION,
    returnUrl: body.returnUrl ?? new URL('/', request.url).toString(),
    orderNumber: body.orderNumber ?? crypto.randomUUID(),
  };

  let upstream: Response;
  try {
    upstream = await fetch(paymentsEndpoint(environment), {
      method: 'POST',
      headers: {
        Authorization: secret,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return json(
      {
        error: true,
        message: `Upstream payment request failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  let parsed: UpstreamPaymentResponse | null = null;
  try {
    parsed = text ? (JSON.parse(text) as UpstreamPaymentResponse) : null;
  } catch {
    parsed = null;
  }

  // Pass the upstream response straight through on failure — client's existing
  // failed-state handling uses `error` / `message` / non-2xx identically.
  const upstreamOk = upstream.ok && !parsed?.error;
  const upstreamStatus = parsed?.status;
  const isTerminalOk =
    upstreamOk &&
    !!upstreamStatus &&
    (SUCCESS_STATUSES.has(upstreamStatus) ||
      PENDING_STATUSES.has(upstreamStatus));

  if (!isTerminalOk || !parsed) {
    return new Response(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }

  // Success or pending → sign a JWT and inject a redirectUrl. All the payload
  // fields are already present on the response body we're about to return, so
  // the token exists purely to carry them through a browser redirect with a
  // tamper-evident wrapper.
  let token: string;
  try {
    token = await signCheckoutToken(
      {
        payment_id: parsed.id ?? '',
        customer_id: parsed.customerId ?? parsed.customer?.id ?? '',
        order_number: parsed.orderNumber ?? payload.orderNumber,
        polling_id: '',
        status: upstreamStatus,
      },
      clientKey,
    );
  } catch (err) {
    return json(
      {
        error: true,
        message: `Failed to sign redirect token: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 500 },
    );
  }

  const origin = new URL(request.url).origin;
  const redirectUrl = `${origin}/thank-you?token=${encodeURIComponent(token)}`;

  return json(
    { ...parsed, redirectUrl },
    { status: upstream.status },
  );
}

interface VerifyTokenBody {
  token?: string;
}

async function handleVerifyToken(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readJson<VerifyTokenBody>(request);
  const token = body?.token?.trim();
  if (!token) {
    return json(
      { error: true, message: 'Missing `token` in request body.' },
      { status: 400 },
    );
  }

  const clientKey = requireClientKey(env);
  if (clientKey instanceof Response) return clientKey;

  try {
    const payload = await verifyCheckoutToken(token, clientKey);
    return json({
      payment_id: payload.payment_id,
      customer_id: payload.customer_id,
      order_number: payload.order_number,
      polling_id: payload.polling_id,
      status: payload.status,
    });
  } catch (err) {
    return json(
      {
        error: true,
        message: `Invalid or expired token: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 400 },
    );
  }
}

interface PollPaymentBody {
  payment_id?: string;
  // `polling_id` is threaded through so the future polling endpoint can swap
  // this handler out without touching the client. Unused for now.
  polling_id?: string;
}

async function handlePollPayment(
  request: Request,
  env: Env,
): Promise<Response> {
  const body = await readJson<PollPaymentBody>(request);
  const paymentId = body?.payment_id?.trim();
  if (!paymentId) {
    return json(
      { error: true, message: 'Missing `payment_id` in request body.' },
      { status: 400 },
    );
  }

  const secret = requireSecret(env);
  if (secret instanceof Response) return secret;

  const environment = resolveEnvironment(env);

  let upstream: Response;
  try {
    upstream = await fetch(singlePaymentEndpoint(environment, paymentId), {
      method: 'GET',
      headers: {
        Authorization: secret,
        Accept: 'application/json',
      },
    });
  } catch (err) {
    return json(
      {
        error: true,
        message: `Upstream payment poll failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      },
      { status: 502 },
    );
  }

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/config' && request.method === 'GET') {
      return handleConfig(env);
    }

    if (url.pathname === '/payments' && request.method === 'POST') {
      return handlePayments(request, env);
    }

    if (url.pathname === '/verify-token' && request.method === 'POST') {
      return handleVerifyToken(request, env);
    }

    if (url.pathname === '/poll-payment' && request.method === 'POST') {
      return handlePollPayment(request, env);
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
