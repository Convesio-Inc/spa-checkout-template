/**
 * CheckoutHeader
 * -----------------------------------------------------------------------------
 * Floating card rendered at the top of the checkout page, above the form +
 * summary grid. Sits inside the same `max-w-5xl` container as the grid, so its
 * width matches the two columns below — no edge-to-edge strip.
 *
 * Visual language matches the section cards (`rounded-xl border bg-card p-5`)
 * so the header reads as "the first card" on the page. Brand color is used
 * sparingly for accent: the brand-name kicker is tinted, and the brand icon
 * sits in a brand-tinted border to tie the identity to the page.
 *
 * Layout:
 *   [brand icon]   BRAND NAME (brand kicker)    [optional product hero image]
 *                  Product Name (large)
 *                  Product description (optional, muted)
 *
 * The product hero image on the right is optional; pass `productHeroImage` to
 * enable it. It is hidden on narrow viewports so the title always has room.
 * The product description is also optional; omit `productDescription` to hide.
 *
 * Content source: `checkoutContent.brand` + `checkoutContent.product`
 *
 * Markers:
 *   - root                 data-section="checkout-header"
 *   - brand icon           data-slot="brand-icon"
 *   - brand name           data-slot="brand-name"
 *   - product name         data-slot="product-name"
 *   - product description  data-slot="product-description"
 *   - product hero image   data-slot="product-hero"
 * -----------------------------------------------------------------------------
 */

import { Card, CardContent } from "@/components/ui/card";
import type { BrandConfig, ProductImage } from "@/content/checkout";

export interface CheckoutHeaderProps {
  brand: BrandConfig;
  productName: string;
  productDescription?: string;
  productHeroImage?: ProductImage;
}

export function CheckoutHeader({
  brand,
  productName,
  productDescription,
  productHeroImage,
}: CheckoutHeaderProps) {
  return (
    <Card data-section="checkout-header">
      <CardContent className="flex items-start gap-4 sm:gap-5">
        <img
          data-slot="brand-icon"
          src={brand.icon.src}
          alt={brand.icon.alt}
          className="h-10 w-10 shrink-0 rounded-lg border border-brand/40 object-cover sm:h-11 sm:w-11"
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <span
            data-slot="brand-name"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-brand"
          >
            {brand.name}
          </span>
          <h1
            data-slot="product-name"
            className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl"
          >
            {productName}
          </h1>
          {productDescription && (
            <p
              data-slot="product-description"
              className="mt-0.5 text-sm text-muted-foreground"
            >
              {productDescription}
            </p>
          )}
        </div>

        {productHeroImage && (
          <img
            data-slot="product-hero"
            src={productHeroImage.src}
            alt={productHeroImage.alt}
            className="hidden h-14 sm:h-24 shrink-0 rounded-lg border border-border object-cover sm:block w-full sm:w-40"
          />
        )}
      </CardContent>
    </Card>
  );
}
