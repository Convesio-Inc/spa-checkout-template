# ConvesioPay SPA Checkout Template

A production-ready **single-page application** that renders an **integrated ConvesioPay checkout**, ready to deploy on [Convesio Static Sites](https://convesio.com). Use it as a minimal, opinionated starting point you can deploy in minutes, extend with your own product copy, and re-skin with your own branding.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4** and **shadcn/ui**, served from a **Cloudflare Worker** that proxies payment calls server-side so your API keys never leave the server.

---

## Table of Contents

- [ConvesioPay SPA Checkout Template](#convesiopay-spa-checkout-template)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [How it Works](#how-it-works)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
    - [1. Get the code](#1-get-the-code)
    - [2. Deploy to Convesio Static Sites](#2-deploy-to-convesio-static-sites)
    - [3. Create a ConvesioPay integration](#3-create-a-convesiopay-integration)
    - [4. Configure environment variables](#4-configure-environment-variables)
    - [5. Verify the checkout](#5-verify-the-checkout)
  - [Environment Variables](#environment-variables)
  - [Testing the Checkout](#testing-the-checkout)
  - [Customization](#customization)
    - [1. Copy, prices and images — `src/content/checkout.ts`](#1-copy-prices-and-images--srccontentcheckoutts)
    - [2. Brand colors — `src/index.css`](#2-brand-colors--srcindexcss)
    - [3. Layout and behavior — section components](#3-layout-and-behavior--section-components)
  - [Local Development](#local-development)
    - [1. Install dependencies](#1-install-dependencies)
    - [2. Configure local secrets](#2-configure-local-secrets)
    - [3. Run the dev server](#3-run-the-dev-server)
  - [Available Scripts](#available-scripts)
  - [Project Structure](#project-structure)
  - [Going Live](#going-live)
  - [Security Notes](#security-notes)
  - [Troubleshooting](#troubleshooting)
  - [Resources](#resources)

---

## Features

- **Full checkout flow out of the box** — product page, checkout form (customer + shipping + payment), order summary and a "Thank You" confirmation page.
- **Secure by design** — your secret keys live only in the Cloudflare Worker; the browser never sees them.
- **Re-skinnable in minutes** — all copy, prices and images are centralized in a single config file, and your brand color is driven by three CSS variables.
- **Sandbox-first** — ships in test mode so you can iterate safely before going live with a single environment-variable change.
- **Modern stack** — React 19, TypeScript, Vite, Tailwind v4, shadcn/ui components, React Router 7.

---

## How it Works

```text
                 ┌────────────────────────┐
                 │   Browser (SPA)        │
                 │   React + ConvesioPay  │
                 │   iframe SDK           │
                 └───────────┬────────────┘
                             │  1. GET /config       (public client key)
                             │  2. POST /payments    (tokenized card)
                             ▼
                 ┌────────────────────────┐
                 │  Cloudflare Worker     │
                 │  worker/index.ts       │
                 │  Holds CPAY_SECRET +   │
                 │  CPAY_API_KEY          │
                 └───────────┬────────────┘
                             │  Signed, server-to-server
                             ▼
                 ┌────────────────────────┐
                 │  ConvesioPay API       │
                 │  sandbox  /  live      │
                 └────────────────────────┘
```

The SPA tokenizes the card with the ConvesioPay SDK iframe, then the Worker validates the payload and forwards it to ConvesioPay with the secret credentials. The customer is then redirected to the Thank You page with the payment outcome.

---

## Prerequisites

Before you start, make sure you have:

| Requirement | Purpose | Sign-up |
|---|---|---|
| **Convesio account** | Host and deploy the Static Site | [console.convesio.com/register](https://console.convesio.com/register) |
| **ConvesioPay account** | Accept payments through the checkout | [convesiopay.com/auth/sign-up](https://convesiopay.com/auth/sign-up) |

---

## Quick Start

### 1. Get the code

Fork or clone this repository into your own GitHub account:

```bash
git clone https://github.com/Convesio-Inc/spa-checkout-template.git
cd convesio-spa-checkout-template
npm install
```

### 2. Deploy to Convesio Static Sites

From your Convesio console, create a new Static Site pointing at your forked repository. Convesio will build and host it automatically. You'll get a public URL — keep it handy, you'll need it in the next step.

### 3. Create a ConvesioPay integration

1. Log in to the [ConvesioPay Sandbox console](https://dev.convesiopay.com/) (or [ConvesioPay's Live Console](https://convesiopay.com/) for live environments).
2. Navigate to **Advanced Settings → [Connected Integrations](https://dev.convesiopay.com/advanced-settings/connected-integrations)** and click **CREATE NEW INTEGRATION**. Give it a name of your choice — you'll need it later as `CPAY_INTEGRATION`.
3. Copy the **integration secret key** that gets generated. This will be your `CPAY_SECRET`.
4. Under **Client Keys**, paste your Static Site URL and click **Generate Client Key**. Copy it — this will be your `CPAY_CLIENT_KEY`.
5. Go to **Advanced Settings → [Get Your API Key](https://dev.convesiopay.com/advanced-settings/api-key)** and copy your API key. This will be your `CPAY_API_KEY`.

### 4. Configure environment variables

In your Convesio Static Site settings, add the following variables (see [Environment Variables](#environment-variables) below for details):

- `CPAY_INTEGRATION`
- `CPAY_CLIENT_KEY`
- `CPAY_SECRET`
- `CPAY_API_KEY`

### 5. Verify the checkout

Open your Static Site URL and run a test payment using the card numbers from the [Testing the Checkout](#testing-the-checkout) section. If everything is wired up correctly, you'll land on the Thank You page.

---

## Environment Variables

All four credentials are required. They are injected at runtime into the Cloudflare Worker — the browser never has direct access to them.

| Variable | Type | Description |
|---|---|---|
| `CPAY_INTEGRATION` | secret | Name of the integration you created in the ConvesioPay console. |
| `CPAY_CLIENT_KEY` | secret | Public client key bound to your Static Site URL. Sent to the browser to initialize the SDK. |
| `CPAY_SECRET` | secret | Server-side integration secret. **Never expose this client-side.** |
| `CPAY_API_KEY` | secret | ConvesioPay API key used for server-to-server calls. |
| `CPAY_ENVIRONMENT` | var | `"test"` (default) or `"live"`. Configured in `wrangler.jsonc`. |

> The first four are treated as **secrets** in `wrangler.jsonc`. For local development you can also set them via a `.dev.vars` file (see [Local Development](#local-development)).

---

## Testing the Checkout

While `CPAY_ENVIRONMENT` is set to `"test"`, use any of the official ConvesioPay [test cards](https://docs.convesiopay.com/convesiopay-payment-checkout-integration-api/payments/test-cards). A good one to start with:

| Card Number | Type | Expiration | CVC |
|---|---|---|---|
| `4000 0200 0000 0000` | Visa | `03/30` | `737` |

A successful transaction should land the user on the Thank You page. Failed / pending outcomes are rendered through the in-checkout `PaymentStatusDialog`.

---

## Customization

The template is designed to be re-skinned in three layers of increasing depth. **Start from layer 1 and only go deeper if you need to.**

### 1. Copy, prices and images — `src/content/checkout.ts`

This is the **single source of truth** for every user-visible string, price and image on the checkout page (and related pages). Change values here without touching any JSX.

Includes:

- Brand name and icon
- Product name, description, images, benefits and prices
- Form copy (customer / shipping / payment fields, placeholders, labels)
- Order summary and Pay Now CTA
- Footer copy

Replace the placeholder product and brand images in the `public/` folder and reference them from `checkout.ts`.

### 2. Brand colors — `src/index.css`

Three CSS variables drive the primary color of the checkout:

```css
--brand             /* Pay Now button fill */
--brand-foreground  /* Text/icon color on top of --brand */
--brand-accent      /* Pay Now hover fill */
```

Find them in the `/* === BRAND THEME === */` block near the top of `src/index.css`.

### 3. Layout and behavior — section components

Each section of the checkout lives in its own component under `src/components/checkout/`:

- `CheckoutHeader.tsx`
- `CustomerInfoCard.tsx`
- `ShippingInfoCard.tsx`
- `PaymentInfoCard.tsx`
- `OrderSummaryCard.tsx`
- `CheckoutFooter.tsx`
- `PaymentStatusDialog.tsx`

Compose or reorder them in `src/pages/CheckoutPage.tsx`. Each component starts with a JSDoc header listing its props and the `checkout.ts` path that feeds it.

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure local secrets

The SPA dev server alone (`npm run dev`) doesn't need credentials, but the Worker does. Create a `.dev.vars` file at the project root (copy from `.env.example` if present) with the same four credentials described in [Environment Variables](#environment-variables):

```bash
CPAY_CLIENT_KEY=...
CPAY_API_KEY=...
CPAY_SECRET=...
CPAY_INTEGRATION=...
```

> `.dev.vars` is git-ignored. Never commit real credentials.

### 3. Run the dev server

```bash
npm run dev        # Vite dev server (SPA only)
```

For a full local environment that also runs the Cloudflare Worker:

```bash
npm run preview    # Builds + serves through Wrangler
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server (SPA only, no worker). |
| `npm run build` | TypeScript typecheck + Vite production build. |
| `npm run lint` | Run ESLint over the codebase. |
| `npm run preview` | Build and preview the production bundle locally. |
| `npm run deploy` | Build and deploy to Cloudflare via Wrangler. |
| `npm run cf-typegen` | Regenerate Cloudflare binding types from `wrangler.jsonc`. |
| `npm run add-envs` | Push all four ConvesioPay secrets to Cloudflare at once. |

---

## Project Structure

```text
.
├── public/                      Static assets (product & brand images)
├── src/
│   ├── components/
│   │   ├── checkout/            Checkout-page section components
│   │   ├── product/             Product-page components
│   │   ├── thank-you/           Thank-you-page components
│   │   └── ui/                  shadcn/ui primitives
│   ├── content/
│   │   └── checkout.ts          ★ Central config: copy, prices, images
│   ├── hooks/                   Checkout / payment / SDK hooks
│   ├── lib/                     Utilities + ConvesioPay SDK singleton
│   ├── pages/                   Route-level pages (Product, Checkout, ThankYou)
│   ├── index.css                ★ Brand theme tokens
│   ├── App.tsx                  Router setup
│   └── main.tsx                 App entry
├── worker/
│   ├── index.ts                 Worker entry: /config and /payments routes
│   └── jwt.ts                   JWT helpers for secure server calls
├── wrangler.jsonc               Cloudflare Worker configuration
├── package.json
└── README.md
```

---

## Going Live

When you're confident the checkout works end-to-end in sandbox:

1. Create a **production** integration in the live ConvesioPay console (not the `dev.` one) and capture its credentials.
2. Update your Static Site's environment variables with the **live** `CPAY_*` secrets.
3. In `wrangler.jsonc`, change:

   ```jsonc
   "vars": {
     "CPAY_ENVIRONMENT": "live"
   }
   ```

4. Redeploy and process a small real transaction to verify.

---

## Security Notes

- **Always start in sandbox.** Test thoroughly with the [official test cards](https://docs.convesiopay.com/convesiopay-payment-checkout-integration-api/payments/test-cards) before flipping `CPAY_ENVIRONMENT` to `"live"`.
- **Never hardcode credentials.** All keys must live in environment variables, never in frontend code or committed files.
- **Never return the `env` object** from the Worker's `fetch` function on any API endpoint — doing so would expose every secret.
- **Use client keys scoped to your domain.** The `CPAY_CLIENT_KEY` is bound to the Static Site URL you registered in the ConvesioPay console.
- **Keep dependencies up to date** with `npm audit` and regular upgrades.

---

## Troubleshooting

**The checkout iframe doesn't load.**
Check the browser console. Most commonly the `CPAY_CLIENT_KEY` is missing, incorrect, or not whitelisted for your Static Site URL.

**I get a 401 / 403 from `/payments`.**
Verify `CPAY_SECRET`, `CPAY_API_KEY` and `CPAY_INTEGRATION` are set as Worker secrets (not just plain vars) and match the integration you're pointing at.

**Payment succeeds in sandbox but fails in live.**
Live integrations require their own distinct credentials — sandbox keys won't work against the live API. Double-check you've created a separate integration in the production console.

**I changed `checkout.ts` but the page didn't update.**
Stop and restart the dev server. Vite usually hot-reloads, but changes to types can occasionally require a clean restart.

---

## Resources

- [Convesio Console](https://console.convesio.com)
- [ConvesioPay Console](https://convesiopay.com) · [Sandbox Console](https://dev.convesiopay.com)
- [ConvesioPay Checkout Integration Docs](https://docs.convesiopay.com/convesiopay-payment-checkout-integration-api)
- [ConvesioPay Test Cards](https://docs.convesiopay.com/convesiopay-payment-checkout-integration-api/payments/test-cards)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vite](https://vitejs.dev) · [React](https://react.dev) · [Tailwind CSS](https://tailwindcss.com) · [shadcn/ui](https://ui.shadcn.com)
