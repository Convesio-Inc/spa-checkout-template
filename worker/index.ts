/**
 * Cloudflare Worker entry
 * -----------------------------------------------------------------------------
 * Routes:
 *
 *   GET  /config        — returns the public-safe API key + client key the
 *                         browser SDK needs to boot the checkout component.
 *
 *   POST /payments      — server-side proxy to the ConvesioPay payments API.
 *                         Pre-signs a "marker" JWT (no `payment_id`) and
 *                         bakes it into the outgoing `returnUrl`, so that if
 *                         the payment takes the 3DS branch the user comes
 *                         back to `/thank-you?token=<marker>` and the resume
 *                         flow is gated by a worker-signed token. On
 *                         success/pending, signs a proper JWT with the
 *                         payment details and injects a `redirectUrl`
 *                         pointing at `/thank-you?token=<jwt>`. On an
 *                         `actionRequired` (3DS) response, passes the body
 *                         through untouched so the SPA can hand the user off
 *                         to the challenge URL directly.
 *
 *   POST /verify-token  — verifies a thank-you redirect JWT and returns its
 *                         decoded payload. Used by the thank-you page on load.
 *
 *   POST /issue-token   — takes a `payment_id`, looks it up upstream to make
 *                         sure it exists, and signs a fresh JWT from the
 *                         resulting data. Used by the thank-you page after a
 *                         3DS challenge: the SPA stashes the id in
 *                         sessionStorage before redirecting the user to the
 *                         bank, then calls this on return to hydrate a proper
 *                         `?token=<jwt>` URL.
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
import { Hono } from "hono";

import CheckoutBase from "@convesio-inc/checkout-payments-processor";

const app = new Hono<{ Bindings: Env }>();

new CheckoutBase(app);

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;
