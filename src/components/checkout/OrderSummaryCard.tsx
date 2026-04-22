/**
 * OrderSummaryCard
 * -----------------------------------------------------------------------------
 * Sidebar summarizing the order: product photo, product line, shipping, tax,
 * total, and the primary Pay Now CTA with a terms footnote.
 *
 * The Pay Now button is a plain `type="submit"` — the parent `<form>` in
 * `CheckoutPage` owns the `onSubmit` handler that runs the payment flow. The
 * button disables itself while the card widget is invalid (`payDisabled`) or
 * while a payment is in-flight (`payLoading`).
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
 *   - guarantee         data-slot="guarantee-badge"
 *
 * -----------------------------------------------------------------------------
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { PriceRow } from "@/components/checkout/primitives/PriceRow";
import type {
  ProductConfig,
  SummaryConfig,
} from "@/content/checkout";

export interface OrderSummaryCardProps {
  copy: SummaryConfig;
  product: ProductConfig;
  /** When true the Pay Now button is non-interactive. Defaults to false. */
  payDisabled?: boolean;
  /** When true the button shows a spinner and stays disabled. */
  payLoading?: boolean;
}

export function OrderSummaryCard({
  copy,
  product,
  payDisabled = false,
  payLoading = false,
}: OrderSummaryCardProps) {
  const disabled = payDisabled || payLoading;
  const includedLabel = `${product.name}${copy.includedProductSuffix ? ` ${copy.includedProductSuffix}` : ""}`;

  return (
    <Card data-section="order-summary">
      <CardHeader>
        <CardTitle
          data-slot="summary-title"
          className="text-xl font-bold tracking-tight"
        >
          {copy.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div
          data-slot="included-products-list"
          className="rounded-[10px] border border-border bg-[#fafcf8] p-2.5"
        >
          <div
            data-slot="included-product-item"
            className="my-[7px] flex items-center gap-2.5 text-sm"
          >
            <img
              data-slot="included-product-thumb"
              src={product.image.src}
              alt={product.image.alt}
              className="h-12 w-12 shrink-0 rounded-lg border border-[#d6e2d0] object-cover"
            />
            <span className="flex-1 text-foreground">{includedLabel}</span>
            <strong data-slot="included-product-price" className="text-foreground">
              {product.salePrice}
            </strong>
          </div>
        </div>
        <div
          data-slot="included-products-title"
          className="mt-1 text-sm font-bold text-[#1a3c2b]"
        >
          {copy.includedProductsTitle}
        </div>

        <div className="flex flex-col gap-2">
          <PriceRow
            data-slot="product-line"
            line={{
              id: "product",
              label: product.name,
              value: product.salePrice,
            }}
            className="my-2 text-[15px]"
            valueClassName="font-bold"
          />
          <PriceRow data-slot="shipping-line" line={copy.shipping} className="my-2 text-[15px]" />
          <PriceRow data-slot="tax-line" line={copy.tax} className="my-2 text-[15px]" />
          <PriceRow
            data-slot="total-line"
            line={copy.total}
            className="mt-3 border-t border-border pt-3 text-[22px]"
            labelClassName="font-bold text-[#122f22]"
            valueClassName="text-[22px] font-bold text-[#122f22]"
          />
          <Button
            data-slot="cta-primary"
            type="submit"
            size="lg"
            disabled={disabled}
            aria-disabled={disabled}
            className="h-12 w-full rounded-lg border-0 bg-linear-to-b from-pay-cta-from to-pay-cta-to text-base font-extrabold tracking-[0.02em] text-pay-cta-foreground uppercase shadow-pay-cta transition-[transform,box-shadow,background-image] duration-200 hover:from-pay-cta-hover-from hover:to-pay-cta-hover-to hover:shadow-pay-cta-hover motion-safe:animate-pay-cta-pulse cursor-pointer"
          >
            {payLoading && <Spinner data-icon="inline-start" />}
            {copy.ctaLabel}
          </Button>

          <p
            data-slot="cta-footnote"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {copy.ctaFootnote}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
