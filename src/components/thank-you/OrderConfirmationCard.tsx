/**
 * OrderConfirmationCard
 * -----------------------------------------------------------------------------
 * Summarises the purchased item and order totals on the thank-you page.
 * Reuses SectionCard, PriceRow, and Separator from the existing
 * component library.
 *
 * Markers:
 *   - root           data-section="order-confirmation" (via SectionCard)
 *   - product block  data-slot="product-block"
 *   - product image  data-slot="product-image"
 *   Price rows inherit their markers from PriceRow (data-slot="price-row",
 *   data-row-id, data-slot="price-value").
 * -----------------------------------------------------------------------------
 */

import { PriceRow } from "@/components/checkout/primitives/PriceRow";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import { Separator } from "@/components/ui/separator";
import type {
  ProductConfig,
  SummaryConfig,
} from "@/content/config";

export interface OrderConfirmationCardProps {
  title: string;
  product: ProductConfig;
  summary: SummaryConfig;
}

export function OrderConfirmationCard({
  title,
  product,
  summary,
}: OrderConfirmationCardProps) {
  return (
    <SectionCard section="order-confirmation" title={title}>
      <div
        data-slot="product-block"
        className="flex items-center gap-3"
      >
        <img
          data-slot="product-image"
          src={product.image.src}
          alt={product.image.alt}
          className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
        />
        <PriceRow
          line={{ id: "product", label: product.name, value: product.salePrice }}
          className="flex-1"
          labelClassName="font-medium"
          href="/product"
        />
      </div>

      <Separator />

      <PriceRow line={summary.shipping} />
      <PriceRow line={summary.tax} />

      <Separator />

      <PriceRow
        line={summary.total}
        labelClassName="font-bold"
        valueClassName="font-bold"
      />
    </SectionCard>
  );
}
