/**
 * Cloudflare Worker entry
 * -----------------------------------------------------------------------------
 * Routes are registered by Convesio checkout extensions discovered at build
 * time (see `includes/ExtensionLoader.ts` and `includes/Extensions.ts`).
 *
 * Typical routes from `@convesio-inc/checkout-payments-processor`:
 *
 *   GET  /config        — public-safe API key + client key for the browser SDK.
 *   POST /payments      — server-side proxy to the ConvesioPay payments API.
 *   POST /verify-token  — verifies a thank-you redirect JWT.
 *   POST /issue-token   — mints a thank-you JWT for a payment_id (3DS resume).
 *   POST /poll-payment  — proxies payment status for thank-you polling.
 *
 * Secrets (Worker environment):
 *   CPAY_API_KEY, CPAY_CLIENT_KEY, CPAY_SECRET, CPAY_INTEGRATION
 *   CPAY_ENVIRONMENT (plain var; defaults to "test")
 * -----------------------------------------------------------------------------
 */
import { Hono } from "hono";

import CronHandler from "../includes/CronHandler.js";
import Extensions from "../includes/Extensions.js";

const app = new Hono<{ Bindings: Env }>();
const cron = new CronHandler();

Extensions.load(app, cron);

export default {
  fetch: app.fetch,
  scheduled: cron.scheduled,
} satisfies ExportedHandler<Env>;
