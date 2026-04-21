/**
 * Cloudflare Worker entry
 * -----------------------------------------------------------------------------
 * Two routes:
 *
 *   GET  /config    — returns the public-safe API key + client key the browser
 *                     SDK needs to boot the checkout component.
 *
 *   POST /payments  — server-side proxy to the ConvesioPay payments API. The
 *                     browser posts `{ paymentToken, ...customer details }` and
 *                     the worker injects `integration`, `returnUrl` (defaulted
 *                     to the request's origin), and a generated `orderNumber`
 *                     if none was supplied, then forwards the request with the
 *                     secret key.
 *
 * Secrets are sourced from the Worker environment:
 *   CPAY_API_KEY, CPAY_CLIENT_KEY, CPAY_SECRET, CPAY_INTEGRATION
 *   CPAY_ENVIRONMENT (plain var; defaults to "test")
 *
 * `CPAY_ENVIRONMENT` also selects the upstream host: sandbox secrets must hit
 * the sandbox host and vice-versa, otherwise the API returns 401.
 * -----------------------------------------------------------------------------
 */

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/config' && request.method === 'GET') {
      return json({
        apiKey: env.CPAY_API_KEY,
        clientKey: env.CPAY_CLIENT_KEY,
        environment: env.CPAY_ENVIRONMENT ?? 'test',
      });
    }

    if (url.pathname === '/payments' && request.method === 'POST') {
      let body: PaymentRequestBody;
      try {
        body = (await request.json()) as PaymentRequestBody;
      } catch {
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

      // Trimmed defensively — when secrets come in via `.env` on Windows /
      // some editors, stray `\r` / whitespace gets appended and CP rejects
      // the header with "Invalid authentication token".
      const secret = env.CPAY_SECRET?.trim();
      if (!secret) {
        return json(
          {
            error: true,
            message:
              'Worker is missing CPAY_SECRET. Set it via `wrangler secret put` or your `.env` / `.dev.vars` before calling /payments.',
          },
          { status: 500 },
        );
      }

      const environment: 'test' | 'live' =
        env.CPAY_ENVIRONMENT === 'live' ? 'live' : 'test';

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
      return new Response(text, {
        status: upstream.status,
        headers: {
          'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
          'Cache-Control': 'no-store',
        },
      });
    }

    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>
