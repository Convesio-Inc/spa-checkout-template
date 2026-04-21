/**
 * ProductHeader
 * -----------------------------------------------------------------------------
 * Slim brand bar at the top of the product page. Mirrors the visual language
 * of CheckoutHeader without the product info block — that lives in the hero.
 *
 * Markers:
 *   - root         data-section="product-header"
 *   - brand icon   data-slot="brand-icon"
 *   - brand name   data-slot="brand-name"
 * -----------------------------------------------------------------------------
 */

import { Card, CardContent } from "@/components/ui/card";
import type { BrandConfig } from "@/content/checkout";

export interface ProductHeaderProps {
  brand: BrandConfig;
}

export function ProductHeader({ brand }: ProductHeaderProps) {
  return (
    <Card data-section="product-header">
      <CardContent className="flex items-center justify-between">
        <img
          data-slot="brand-icon"
          src={brand.icon.src}
          alt={brand.icon.alt}
          className="h-9 w-9 shrink-0 rounded-lg border border-brand/40 object-cover"
        />
        <span
          data-slot="brand-name"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-brand"
        >
          {brand.name}
        </span>
      </CardContent>
    </Card>
  );
}
