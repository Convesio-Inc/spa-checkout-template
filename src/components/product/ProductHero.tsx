/**
 * ProductHero
 * -----------------------------------------------------------------------------
 * Two-column hero section on the product page. Large product image on the left,
 * name / price / description / benefits / CTA on the right. Stacks to single
 * column on mobile.
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

const PRODUCT_HERO_IMAGE = {
  src: "/product-image.jpeg",
  alt: "Vitamin Essentials Pack product photo",
};
const PRODUCT_BENEFITS = [
  "12 essential vitamins in one daily capsule",
  "Supports immune function and sustained energy",
  "Third-party tested for purity and potency",
  "Vegan-friendly, non-GMO, no artificial fillers",
  "Backed by our 60-day money-back guarantee",
];

export function ProductHero() {
  return (
    <Card data-section="product-hero">
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {/* Image column */}
        <div data-region="product-image-col" className="flex items-start">
          <img
            data-slot="product-image"
            src={PRODUCT_HERO_IMAGE.src}
            alt={PRODUCT_HERO_IMAGE.alt}
            className="w-full rounded-lg border border-border object-cover"
          />
        </div>

        {/* Info column */}
        <div data-region="product-info-col" className="flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            BioVerve
          </span>

          <h1
            data-slot="product-name"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            Vitamin Essentials Pack
          </h1>

          <div data-slot="price-block" className="flex items-baseline gap-2">
            <span
              data-slot="regular-price"
              className="text-base text-muted-foreground line-through"
            >
              $79.00
            </span>
            <span
              data-slot="sale-price"
              className="text-3xl font-extrabold tracking-tight text-foreground"
            >
              $49.00
            </span>
            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
              Sale
            </span>
          </div>

          <p
            data-slot="product-description"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            A daily blend of 12 essential vitamins to support energy, immunity, and overall wellness.
          </p>

          <ul data-slot="benefits-list" className="flex flex-col gap-2">
            {PRODUCT_BENEFITS.map((benefit, i) => (
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

          <Button
            data-slot="cta-primary"
            size="lg"
            asChild
            className="mt-auto h-12 w-full rounded-lg bg-brand text-base font-semibold text-brand-foreground hover:bg-brand-accent"
          >
            <a href="/">Proceed to Checkout</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
