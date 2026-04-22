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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { GuaranteeBadge } from "@/components/checkout/primitives/GuaranteeBadge";
import { PriceRow } from "@/components/checkout/primitives/PriceRow";
import { SecureBadge } from "@/components/checkout/primitives/SecureBadge";
import type {
  GuaranteeCopy,
  ProductConfig,
  SecurityCopy,
  SummaryConfig,
} from "@/content/config";

export interface OrderSummaryCardProps {
  copy: SummaryConfig;
  product: ProductConfig;
  security: SecurityCopy;
  guarantee: GuaranteeCopy;
  /** When true the Pay Now button is non-interactive. Defaults to false. */
  payDisabled?: boolean;
  /** When true the button shows a spinner and stays disabled. */
  payLoading?: boolean;
}

export function OrderSummaryCard({
  copy,
  product,
  security,
  guarantee,
  payDisabled = false,
  payLoading = false,
}: OrderSummaryCardProps) {
  const disabled = payDisabled || payLoading;

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
            href="/product"
            line={{
              id: "product",
              label: product.name,
              value: product.salePrice,
            }}
            regularValue={product.regularPrice}
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
      </CardContent>

      <CardFooter className="flex-col items-start gap-3">
        <Button
          data-slot="cta-primary"
          type="submit"
          size="lg"
          disabled={disabled}
          aria-disabled={disabled}
          className="h-12 w-full rounded-lg bg-brand text-base font-semibold text-brand-foreground hover:bg-brand-accent"
        >
          {payLoading && <Spinner data-icon="inline-start" />}
          {copy.ctaLabel}
        </Button>

        <SecureBadge label={security.label} className="self-center" />

        <p
          data-slot="cta-footnote"
          className="text-xs leading-relaxed text-muted-foreground"
        >
          {copy.ctaFootnote}
        </p>

        <GuaranteeBadge
          days={guarantee.days}
          daysLabel={guarantee.daysLabel}
          title={guarantee.title}
          description={guarantee.description}
        />
      </CardFooter>
    </Card>
  );
}
