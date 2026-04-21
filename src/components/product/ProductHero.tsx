/**
 * ProductHero
 * -----------------------------------------------------------------------------
 * Two-column hero section on the product page. Large product image on the left,
 * name / price / description / benefits / CTA on the right. Stacks to single
 * column on mobile.
 *
 * If `product.regularPrice` is set, it renders as a strikethrough beside the
 * sale price so the discount is immediately visible.
 *
 * Markers:
 *   - root                 data-section="product-hero"
 *   - image column         data-region="product-image-col"
 *   - info column          data-region="product-info-col"
 *   - product image        data-slot="product-image"
 *   - product name         data-slot="product-name"
 *   - price block          data-slot="price-block"
 *   - regular price        data-slot="regular-price"
 *   - sale price           data-slot="sale-price"
 *   - product description  data-slot="product-description"
 *   - benefits list        data-slot="benefits-list"
 *   - benefit item         data-slot="benefit-item"
 *   - cta primary          data-slot="cta-primary"
 * -----------------------------------------------------------------------------
 */

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BrandConfig, ProductConfig, ProductPageCopy } from "@/content/checkout";

export interface ProductHeroProps {
  brand: BrandConfig;
  product: ProductConfig;
  copy: ProductPageCopy;
}

export function ProductHero({ brand, product, copy }: ProductHeroProps) {
  const heroImg = product.heroImage ?? product.image;

  return (
    <Card data-section="product-hero">
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* Image column */}
        <div data-region="product-image-col" className="flex items-start">
          <img
            data-slot="product-image"
            src={heroImg.src}
            alt={heroImg.alt}
            className="w-full rounded-lg border border-border object-cover"
          />
        </div>

        {/* Info column */}
        <div data-region="product-info-col" className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            {brand.name}
          </span>

          <h1
            data-slot="product-name"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {product.name}
          </h1>

          <div data-slot="price-block" className="flex items-baseline gap-2">
            {product.regularPrice && (
              <span
                data-slot="regular-price"
                className="text-base text-muted-foreground line-through"
              >
                {product.regularPrice}
              </span>
            )}
            <span
              data-slot="sale-price"
              className="text-3xl font-extrabold tracking-tight text-foreground"
            >
              {product.salePrice}
            </span>
            {product.regularPrice && (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                Sale
              </span>
            )}
          </div>

          {product.description && (
            <p
              data-slot="product-description"
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {product.description}
            </p>
          )}

          {product.benefits && product.benefits.length > 0 && (
            <ul data-slot="benefits-list" className="flex flex-col gap-2">
              {product.benefits.map((benefit, i) => (
                <li
                  key={i}
                  data-slot="benefit-item"
                  className="flex items-start gap-2 text-sm text-foreground"
                >
                  <CheckIcon
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-brand"
                  />
                  {benefit}
                </li>
              ))}
            </ul>
          )}

          <Button
            data-slot="cta-primary"
            size="lg"
            asChild
            className="mt-auto h-12 w-full rounded-lg bg-brand text-base font-semibold text-brand-foreground hover:bg-brand-accent"
          >
            <a href="/">{copy.ctaLabel}</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
