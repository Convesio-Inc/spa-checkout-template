/**
 * OrderSummaryCard
 * -----------------------------------------------------------------------------
 * Sidebar summarizing the order: product photo, product line, shipping, tax,
 * total, and the primary Pay Now CTA with a terms footnote.
 *
 * The Pay Now button is intentionally inert — it only logs a notice in dev.
 *
 * Content source: `checkoutContent.summary` + `checkoutContent.product`
 *
 * Markers:
 *   - root              data-section="order-summary"
 *   - product block     data-slot="product-block"
 *   - product line      data-slot="product-line"
 *   - shipping line     data-slot="shipping-line"
 *   - tax line          data-slot="tax-line"
 *   - total line        data-slot="total-line"
 *   - primary cta       data-slot="cta-primary"
 *   - cta footnote      data-slot="cta-footnote"
 * -----------------------------------------------------------------------------
 */

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PriceRow } from "@/components/checkout/primitives/PriceRow";
import type { ProductConfig, SummaryConfig } from "@/content/checkout";

export interface OrderSummaryCardProps {
  copy: SummaryConfig;
  product: ProductConfig;
}

export function OrderSummaryCard({ copy, product }: OrderSummaryCardProps) {
  const handlePayNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (import.meta.env.DEV) {
      console.info(
        "[checkout-template] Pay Now clicked — this template has no payment flow."
      );
    }
  };

  return (
    <aside
      data-section="order-summary"
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-card-foreground"
    >
      <h2
        data-slot="summary-title"
        className="text-xl font-bold tracking-tight"
      >
        {copy.title}
      </h2>

      <div data-slot="product-block" className="flex flex-col gap-3">
        <img
          data-slot="product-image"
          src={product.image.src}
          alt={product.image.alt}
          className="w-full rounded-lg border border-border object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <PriceRow
          data-slot="product-line"
          line={{
            id: "product",
            label: product.name,
            value: product.unitPrice,
          }}
        />
        <PriceRow data-slot="shipping-line" line={copy.shipping} />
        <PriceRow data-slot="tax-line" line={copy.tax} />
      </div>

      <Separator />

      <PriceRow
        data-slot="total-line"
        line={copy.total}
        labelClassName="text-base font-bold text-foreground"
        valueClassName="text-base font-bold text-foreground"
      />

      <Button
        data-slot="cta-primary"
        type="button"
        size="lg"
        onClick={handlePayNow}
        className="mt-1 h-12 w-full rounded-lg bg-brand text-base font-semibold text-brand-foreground hover:bg-brand-accent"
      >
        {copy.ctaLabel}
      </Button>

      <p
        data-slot="cta-footnote"
        className="text-xs leading-relaxed text-muted-foreground"
      >
        {copy.ctaFootnote}
      </p>
    </aside>
  );
}
