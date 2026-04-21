# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server (SPA only, no worker)
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Preview production build locally
npm run deploy       # Build + deploy to Cloudflare via Wrangler
npm run cf-typegen   # Regenerate Cloudflare bindings types from wrangler.jsonc
npm run add-envs     # Push secrets to Cloudflare
```

No automated tests exist in this project.

For local development with the worker, copy `.env.example` to `.dev.vars` and fill in the ConvesioPay credentials.

## Architecture

React 19 + TypeScript SPA (Vite) deployed as a **Cloudflare Worker** (`@cloudflare/vite-plugin`). The worker serves the SPA and proxies payment API calls server-side so secrets never reach the browser.

### Payment flow (end-to-end)

1. SPA loads → `useConvesioPayCheckout` calls `GET /config` on the worker → receives `{ apiKey, clientKey, environment }`
2. Hook initializes the ConvesioPay SDK (injected via `<script>` in `index.html`) and mounts its iframe into a ref
3. User fills customer + shipping fields; form state lives in `CheckoutPage`
4. Submit → `component.createToken()` tokenizes the card → `useCheckoutPayment.pay()` POSTs to `POST /payments`
5. Worker validates the payload, injects `CPAY_SECRET` / `CPAY_INTEGRATION`, and proxies to ConvesioPay (sandbox or live based on `CPAY_ENVIRONMENT`)
6. `PaymentStatusDialog` renders the outcome: success / pending / failed

### Key files

| File | Role |
|---|---|
| `src/content/checkout.ts` | **Start here for any copy/price/image change.** Typed config object; each section has its own interface. |
| `src/index.css` | `/* === BRAND THEME === */` block — three `--brand*` tokens drive button color, hover, and text. |
| `src/pages/CheckoutPage.tsx` | Owns all form state; wires the two hooks together; drives `PaymentStatusDialog`. |
| `src/hooks/useConvesioPayCheckout.ts` | Config fetch → SDK init → iframe mount lifecycle; returns `{ component, isValid, status }`. |
| `src/hooks/useCheckoutPayment.ts` | State machine: idle → processing → success / pending / failed. |
| `src/lib/convesiopay.ts` | Module-level singletons: cached config promise + single SDK instance (never re-initialized). |
| `worker/index.ts` | `GET /config` and `POST /payments` routes. Upstream host chosen by `CPAY_ENVIRONMENT`. |

### Worker secrets

Declared in `wrangler.jsonc`, typed in `worker/env.d.ts`:
- `CPAY_CLIENT_KEY`, `CPAY_API_KEY`, `CPAY_SECRET`, `CPAY_INTEGRATION`
- `CPAY_ENVIRONMENT` — `"test"` (default) or `"live"`

## Customization layers

Three layers in increasing depth — only go deeper than you need:

1. **Copy / prices / images** → `src/content/checkout.ts` (no JSX changes needed)
2. **Brand colors** → `/* === BRAND THEME === */` block in `src/index.css`
3. **Layout or behaviour** → section components under `src/components/checkout/`; compose or reorder them in `CheckoutPage.tsx`

Each section component starts with a JSDoc header listing its props and the `checkout.ts` path that feeds it.

## Semantic markers (preserve when editing)

The DOM uses a stable vocabulary of `data-*` attributes so tools and scripts can target elements without relying on CSS classes:

| Attribute | Where | Meaning |
|---|---|---|
| `data-page` | `<main>` in `CheckoutPage` | Top-level page id (`checkout`) |
| `data-region` | Layout columns | Coarse regions (`form-stack`, `summary`) |
| `data-section` | Section root elements | Named section (`customer-info`, `order-summary`, …) |
| `data-slot` | Swappable leaf nodes | Role of a node (`product-image`, `cta-primary`, `total-line`, …) |
| `data-field` | Form inputs | Stable field id (`email`, `card-number`, …) |
| `data-row-id` | `PriceRow` | Matches `id` of a `PriceLine` in content |

Source regions are wrapped in `// #region SECTION: <Name>` / `// #endregion` comments — preserve these fold markers when editing.

## Conventions

- `cn()` from `src/lib/utils.ts` is the standard class-merging utility (clsx + tailwind-merge).
- shadcn UI primitives live in `src/components/ui/`. Checkout-specific primitives (`SectionCard`, `PriceRow`, `SecureBadge`, `GuaranteeBadge`) live in `src/components/checkout/primitives/`.
- The ConvesioPay SDK instance is a module-level singleton in `src/lib/convesiopay.ts` — do not instantiate it elsewhere.
