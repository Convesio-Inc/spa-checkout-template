# ConvesioPay SPA Checkout Template

This repository is a **single-page application** (SPA) that renders an
**integrated ConvesioPay checkout**. It is intended for **Convesio users** who
want a minimal, opinionated starting point they can **deploy**, **extend**, and
re-skin with their own branding and flows.

Built with React, TypeScript, and Vite, with optional Cloudflare Workers
deployment via Wrangler.

## Scripts

- `npm run dev` — local development server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run deploy` — build and deploy with Wrangler
- `npm run lint` — run ESLint

## Project Structure

```
src/
  App.tsx                         # renders <CheckoutPage />
  content/
    checkout.ts                   # all user-visible copy, prices, images
  pages/
    CheckoutPage.tsx              # top-level two-column layout
  components/
    checkout/
      CustomerInfoCard.tsx        # email
      ShippingInfoCard.tsx        # full name, street, city, zip
      PaymentInfoCard.tsx         # card number, expiration, CVV
      OrderSummaryCard.tsx        # product, shipping, tax, total, Pay Now
      primitives/
        SectionCard.tsx           # shared wrapper for form sections
        PriceRow.tsx              # label/value row for the order summary
    ui/                           # shadcn components (button, field, input, …)
  index.css                       # Tailwind v4 theme + BRAND THEME block
  lib/utils.ts                    # cn() helper
```

## Customization Guide

The template is designed so every visual and textual change happens in a
predictable location. Three layers, in increasing implementation depth:

### 1. Swap copy, prices, and images → `src/content/checkout.ts`

All user-visible strings, pricing, and image paths live in this single, typed
file. Each section of the page has its own interface (`PageCopy`,
`ProductConfig`, `CustomerFormCopy`, `ShippingFormCopy`, `PaymentFormCopy`,
`SummaryConfig`). Edit this file to change what the checkout **says** and
**shows** without touching any JSX.

Replace the placeholder image under `public/product-summary-image.jpeg` with
your own asset, or update the `product.image.src` path in `checkout.ts`.

### 2. Re-theme colors → `BRAND THEME` block in `src/index.css`

Brand-specific colors are centralized near the top of `:root` under a clearly
labelled `/* === BRAND THEME === */` block:

```css
:root {
  --brand:              oklch(0.66 0.19 262); /* Pay Now button fill   */
  --brand-foreground:   oklch(0.99 0 0);      /* Text/icon on --brand  */
  --brand-accent:       oklch(0.58 0.17 262); /* Pay Now hover fill    */
}
```

These tokens are mapped into the Tailwind v4 theme (see the `@theme inline`
block above) as `bg-brand`, `text-brand-foreground`, `bg-brand-accent`, etc.
The surrounding dark-mode surface/text/border tokens (`--background`,
`--card`, `--border`, `--foreground`, `--muted-foreground`, …) are defined
right below and can be tweaked the same way.

### 3. Restructure layout or behaviour → section components

Every section is its own file under `src/components/checkout/` and begins
with a JSDoc header describing its purpose, its props, and the path in
`checkout.ts` that feeds it. Compose, reorder, or remove sections from
`src/pages/CheckoutPage.tsx`.

## Section & Slot Markers

To make the page easy to parse (for tools, scripts, or automated editors), the
DOM carries a small, stable vocabulary of `data-*` attributes and matching
`// #region SECTION: ...` comments. These are purely semantic and describe
**what** a node is.

| Attribute          | Where                      | Meaning                                                  |
| ------------------ | -------------------------- | -------------------------------------------------------- |
| `data-page`        | `<main>` in `CheckoutPage` | Top-level page identifier (`checkout`).                  |
| `data-region`      | Layout columns             | Coarse regions inside the page (`form-stack`, `summary`).|
| `data-section`     | Section root elements      | Named section (e.g. `customer-info`, `order-summary`).   |
| `data-slot`        | Swappable leaf nodes       | Role of a specific node (`product-image`, `cta-primary`, `total-line`, …). |
| `data-field`       | Form fields                | Stable form-field id (`email`, `card-number`, …).        |
| `data-row-id`      | `PriceRow`                 | Matches the `id` of a `PriceLine` in content.            |

Every JSX section is also wrapped in `// #region SECTION: <Name>` /
`// #endregion` blocks so code folds tidily in most editors and is easy to
locate via grep.

## Scope

The template is **purely presentational**:

- Form `onSubmit` is a no-op (`preventDefault`).
- The "Pay Now" button logs a dev-only notice and does nothing else.
- There is no routing, no backend call, and no payment SDK wired up. The
  `ConvesioPay` client is referenced with a placeholder API key but its
  return value is discarded — integrate your own flow on top.

Wire up your own submission, validation, and payment flow on top of the
existing inputs — the `data-field` and `data-section` attributes make it easy
to target them.
