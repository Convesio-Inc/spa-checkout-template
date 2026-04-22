# SPA Checkout Template

This repository serves as a production-ready **single-page application** that renders an **integrated ConvesioPay checkout**, ready to deploy on Convesio Static Sites. 
It is a template with native integration to Convesio Pay, thought for Convesio users to use as a starting point.

## Commands

```bash
npm run dev          # Vite dev server (SPA only, no worker)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Build + serve through Wrangler (full worker environment)
npm run deploy       # Build + deploy to Cloudflare via Wrangler
npm run cf-typegen   # Regenerate Cloudflare bindings types from wrangler.jsonc
npm run add-envs     # Push all four ConvesioPay secrets to Cloudflare
```

No automated tests exist in this project.

For local development with the worker, create a `.dev.vars` file at the project root with the four ConvesioPay credentials (see [Worker secrets](#worker-secrets)).

## Architecture

React 19 + TypeScript SPA (Vite) deployed as a **Cloudflare Worker** (`@cloudflare/vite-plugin`). The worker serves the SPA and proxies payment API calls server-side so secrets never reach the browser. Routing is handled by React Router 7 in `src/App.tsx` (`/`, `/product`, `/thank-you`).

### Payment flow (end-to-end)

1. SPA loads → `useConvesioPayCheckout` calls `GET /config` on the worker → receives `{ apiKey, clientKey, environment }`.
2. Hook initializes the ConvesioPay SDK (injected via `<script>` in `index.html`) and mounts its iframe into a ref.
3. User fills customer + shipping fields; form state lives in `CheckoutPage`.
4. Submit → `component.createToken()` tokenizes the card → `useCheckoutPayment.pay()` POSTs to `POST /payments`.
5. Worker validates the payload, **pre-signs a "marker" JWT** (no `payment_id` — we don't have one yet) and bakes it into the outgoing `returnUrl` as `/thank-you?token=<marker>`. It then injects `CPAY_SECRET` / `CPAY_INTEGRATION` and proxies to ConvesioPay (sandbox or live based on `CPAY_ENVIRONMENT`).
6. On `Succeeded` / `Authorized` / `Pending`, the worker **signs a second HS256 JWT** (`worker/jwt.ts`, keyed on `CPAY_CLIENT_KEY`) carrying `{ payment_id, customer_id, order_number, status }` and returns a `redirectUrl` of `/thank-you?token=<jwt>`. If the upstream response carries `actionRequired` (a 3DS / verify-customer challenge), the worker passes the body through untouched — the SPA handles the handoff itself, and the bank will later redirect the user back to the `returnUrl` containing the marker JWT. On any other status / error, it passes the upstream response straight through.
7. `useCheckoutPayment.pay()` keeps the processing dialog up and `window.location.assign()`s to the redirect URL. `PaymentStatusDialog` is now only surfaced for `processing` and `failed` — success / pending are owned by the thank-you page. On an `actionRequired` response, the hook stashes `{ payment_id, order_number }` in `sessionStorage[cpay_pending_payment]` before navigating the user to `actionRequired.redirectUrl`.
8. `ThankYouPage` + `useThankYouPayment` call `POST /verify-token` on mount, then, if the status is `Pending`, poll `POST /poll-payment` every 5s until the upstream status flips to terminal. Layout swaps between `verifying` / `pending` / `succeeded` / `failed` without a full re-layout. If the decoded JWT has an empty `payment_id` (the marker signed in step 5), the hook resolves the id from the `?paymentId=` URL param or the sessionStorage bridge, POSTs it to `/issue-token` to mint a proper JWT, then `history.replaceState`s the URL to `/thank-you?token=<jwt>` before running the normal verify + poll loop.

### Key files

| File | Role |
|---|---|
| `src/content/config.ts` | **Start here for any copy/price/image change.** Typed config object; each section has its own interface. |
| `src/index.css` | `/* === BRAND THEME === */` block — three `--brand*` tokens drive button color, hover, and text. |
| `src/App.tsx` | React Router 7 routes: `/` → `CheckoutPage`, `/product` → `ProductPage`, `/thank-you` → `ThankYouPage`. |
| `src/pages/CheckoutPage.tsx` | Owns all form state; wires the two hooks together; drives `PaymentStatusDialog`. |
| `src/pages/ThankYouPage.tsx` | Post-checkout landing page driven by the `?token=` JWT; renders verifying / pending / succeeded / failed. |
| `src/pages/ProductPage.tsx` | Optional product page mounted at `/product`. |
| `src/hooks/useConvesioPayCheckout.ts` | Config fetch → SDK init → iframe mount lifecycle; returns `{ component, isValid, status }`. |
| `src/hooks/useCheckoutPayment.ts` | State machine: `idle → processing → success / pending / failed`. On success/pending the hook hands off to the worker's `redirectUrl` instead of surfacing a modal. On 3DS `actionRequired`, stashes the payment id in sessionStorage and redirects to the challenge URL. Also exports `PENDING_PAYMENT_SESSION_KEY` / `PENDING_PAYMENT_MAX_AGE_MS`. |
| `src/hooks/useThankYouPayment.ts` | Thank-you state machine: verify JWT → poll `/poll-payment` every 5s while pending → resolve to succeeded/failed. When loaded without a `?token=`, hydrates one via `/issue-token` from a `?paymentId=` query param or the sessionStorage bridge set by the checkout hook. |
| `src/lib/convesiopay.ts` | Module-level singletons: cached config promise + single SDK instance (never re-initialized). |
| `worker/index.ts` | Worker entry: `/config`, `/payments`, `/verify-token`, `/issue-token`, `/poll-payment` routes. Upstream host chosen by `CPAY_ENVIRONMENT`. |
| `worker/jwt.ts` | HS256 `signCheckoutToken` / `verifyCheckoutToken` helpers for the thank-you redirect token. |

### Worker routes

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/config` | Returns `{ apiKey, clientKey, environment }` to boot the browser SDK. |
| `POST` | `/payments` | Proxies to ConvesioPay's payments API. Pre-signs a marker JWT into the outgoing `returnUrl` so 3DS returns land on `/thank-you?token=<marker>`. On success/pending, signs a proper JWT and injects `redirectUrl: /thank-you?token=<jwt>`. On `actionRequired` (3DS), passes the body through for the SPA to handle the challenge handoff. |
| `POST` | `/verify-token` | Verifies a thank-you redirect JWT and returns its decoded payload. |
| `POST` | `/issue-token` | Mints a fresh thank-you JWT for a `payment_id` (verified to exist upstream). Used by the thank-you page to recover from a 3DS return when no `?token=` is present. |
| `POST` | `/poll-payment` | Proxies `GET /v1/payments/:id` upstream so the thank-you page can poll a pending payment. |

### Worker secrets

Declared in `wrangler.jsonc` (as `secrets.required`, so Wrangler fails the deploy if any are missing) and typed in `worker/env.d.ts`:

- `CPAY_CLIENT_KEY`, `CPAY_API_KEY`, `CPAY_SECRET`, `CPAY_INTEGRATION`
- `CPAY_ENVIRONMENT` — plain var; `"test"` (default) or `"live"`. Also selects the upstream host (`api.convesiopay.com` vs `api-qa.convesiopay.com`) — sandbox keys against live (or vice-versa) return a 401.

## Customization layers

Three layers in increasing depth — only go deeper than you need:

1. **Copy / prices / images** → `src/content/config.ts` (no JSX changes needed)
2. **Brand colors** → `/* === BRAND THEME === */` block in `src/index.css`
3. **Layout or behaviour** → section components under `src/components/checkout/`, `src/components/product/`, `src/components/thank-you/`; compose or reorder them in the matching page under `src/pages/`.

Section components live in three families:

- `src/components/checkout/` — `CheckoutHeader`, `CheckoutTimer`, `CustomerInfoCard`, `ShippingInfoCard`, `PaymentInfoCard`, `OrderSummaryCard`, `CheckoutFooter`, `PaymentStatusDialog`, plus `primitives/` (`SectionCard`, `PriceRow`, `SecureBadge`, `GuaranteeBadge`).
- `src/components/product/` — `ProductHeader`, `ProductHero`, `ProductCopySection`.
- `src/components/thank-you/` — `ThankYouHeader`, `OrderConfirmationCard`, `NextStepsCard`.

Each section component starts with a JSDoc header listing its props and the `config.ts` path that feeds it.

## Semantic markers (preserve when editing)

The DOM uses a stable vocabulary of `data-*` attributes so tools and scripts can target elements without relying on CSS classes:

| Attribute | Where | Meaning |
|---|---|---|
| `data-page` | `<main>` in page components | Top-level page id (`checkout`, `thank-you`, …) |
| `data-region` | Layout columns | Coarse regions (`form-stack`, `summary`) |
| `data-section` | Section root elements | Named section (`customer-info`, `order-summary`, `secure-notice`, `guarantee`, `thank-you-failure`, …) |
| `data-slot` | Swappable leaf nodes | Role of a node (`product-image`, `cta-primary`, `total-line`, …) |
| `data-field` | Form inputs | Stable field id (`email`, `card-number`, …) |
| `data-row-id` | `PriceRow` | Matches `id` of a `PriceLine` in content |

Source regions are wrapped in `// #region SECTION: <Name>` / `// #endregion` comments — preserve these fold markers when editing.

## Conventions

- `cn()` from `src/lib/utils.ts` is the standard class-merging utility (clsx + tailwind-merge).
- shadcn UI primitives live in `src/components/ui/`. Checkout-specific primitives (`SectionCard`, `PriceRow`, `SecureBadge`, `GuaranteeBadge`) live in `src/components/checkout/primitives/`.
- The ConvesioPay SDK instance is a module-level singleton in `src/lib/convesiopay.ts` — do not instantiate it elsewhere.
- `SUCCESS_STATUSES` (`"Succeeded"`, `"Authorized"`) and `PENDING_STATUSES` (`"Pending"`) are intentionally duplicated between `src/hooks/useCheckoutPayment.ts`, `src/hooks/useThankYouPayment.ts`, and `worker/index.ts` — the worker and SPA compile as separate bundles, so keep all three in sync when changing them.
- Never return the Worker `env` object from any response — it would leak every secret.
