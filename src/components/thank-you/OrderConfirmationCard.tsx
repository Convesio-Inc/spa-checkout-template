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

export function OrderConfirmationCard() {
  return (
    <SectionCard section="order-confirmation" title="Order Summary">
      <div
        data-slot="product-block"
        className="flex items-center gap-3"
      >
        <img
          data-slot="product-image"
          src="/product-summary-image.jpeg"
          alt="Vitamin Essentials Pack product photo"
          className="h-14 w-14 shrink-0 rounded-lg border border-border object-cover"
        />
        <PriceRow
          line={{ id: "product", label: "Vitamin Essentials Pack", value: "$49.00" }}
          className="flex-1"
          labelClassName="font-medium"
          href="/product"
        />
      </div>

      <Separator />

      <PriceRow line={{ id: "shipping", label: "Shipping", value: "$7.95" }} />
      <PriceRow line={{ id: "tax", label: "Tax", value: "$0.00" }} />

      <Separator />

      <PriceRow
        line={{ id: "total", label: "Total", value: "$56.95" }}
        labelClassName="font-bold"
        valueClassName="font-bold"
      />
    </SectionCard>
  );
}
