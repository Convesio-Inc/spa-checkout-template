/**
 * CheckoutPage
 * -----------------------------------------------------------------------------
 * Top-level static checkout page. Composes every section into a two-column
 * layout (form on the left, order summary on the right) that collapses to a
 * single column on narrow viewports.
 *
 * This component owns the page `<form>` wrapper — its `onSubmit` is a pure
 * preventDefault, by design. The template has no backend or flow.
 *
 * All copy, images, and pricing come from `src/content/checkout.ts`.
 * All colors come from the `BRAND THEME` block in `src/index.css`.
 *
 * Markers:
 *   - root            data-page="checkout"
 *   - form column     data-region="form-stack"
 *   - summary column  data-region="summary"
 * -----------------------------------------------------------------------------
 */

import { CustomerInfoCard } from "@/components/checkout/CustomerInfoCard";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { PaymentInfoCard } from "@/components/checkout/PaymentInfoCard";
import { ShippingInfoCard } from "@/components/checkout/ShippingInfoCard";
import { checkoutContent } from "@/content/checkout";

export function CheckoutPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const { page, product, customer, shipping, payment, summary } =
    checkoutContent;

  return (
    <main data-page="checkout" className="min-h-dvh bg-background py-6 sm:py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-5xl px-4 sm:px-6"
        noValidate
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* #region SECTION: Form Stack */}
          <div
            data-region="form-stack"
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground"
          >
            <header data-section="page-header" className="flex flex-col gap-1">
              <h1
                data-slot="page-title"
                className="text-2xl font-bold tracking-tight"
              >
                {page.title}
              </h1>
              <p
                data-slot="page-subtitle"
                className="text-sm text-muted-foreground"
              >
                {page.subtitle}
              </p>
            </header>

            <CustomerInfoCard copy={customer} />
            <ShippingInfoCard copy={shipping} />
            <PaymentInfoCard copy={payment} />
          </div>
          {/* #endregion */}

          {/* #region SECTION: Order Summary */}
          <div data-region="summary" className="lg:sticky lg:top-6">
            <OrderSummaryCard
              copy={summary}
              product={product}
            />
          </div>
          {/* #endregion */}
        </div>
      </form>
    </main>
  );
}
