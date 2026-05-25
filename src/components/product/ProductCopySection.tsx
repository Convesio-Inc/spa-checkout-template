/**
 * ProductCopySection
 * -----------------------------------------------------------------------------
 * Renders the product body copy as a styled content block. Edit the JSX
 * in PRODUCT_COPY below to update the long-form product description.
 *
 * The JSX is authored internally and never sourced from user input, so
 * dangerouslySetInnerHTML is safe here.
 *
 * Markers:
 *   - root   data-section="product-copy"
 * -----------------------------------------------------------------------------
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PRODUCT_COPY = (
  <>
    <h2>Why Vitamin Essentials Pack?</h2>
    <p>Most people don't get everything they need from diet alone. Vitamin Essentials Pack was formulated to fill those gaps — delivering a precise daily dose of the 12 vitamins your body relies on most, in forms it can actually absorb.</p>
    <h3>Key Ingredients</h3>
    <ul>
      <li><strong>Vitamin D3</strong> — Supports bone density and immune resilience, especially in low-sunlight months.</li>
      <li><strong>Vitamin B12</strong> — Drives energy metabolism and reduces fatigue at the cellular level.</li>
      <li><strong>Vitamin C</strong> — A potent antioxidant that powers immune response and collagen synthesis.</li>
      <li><strong>Vitamin K2</strong> — Works synergistically with D3 to direct calcium to bones, not arteries.</li>
      <li><strong>Vitamins B1, B2, B3, B5, B6, B7, B9, E</strong> — The remaining eight complete the spectrum for metabolism, skin health, and neurological support.</li>
    </ul>
    <h3>Quality You Can Trust</h3>
    <p>Every batch is independently tested by a third-party lab for potency and absence of heavy metals, allergens, and contaminants. Our capsules are 100% vegan, non-GMO, and free from artificial colours, flavours, and fillers.</p>
    <h3>How to Use</h3>
    <p>Take one capsule daily with a meal. Consistent daily use is key — most customers notice a difference in energy and focus within 2–4 weeks.</p>
  </>
);

export interface ProductCopySectionProps {
  className?: string;
}

export function ProductCopySection({ className }: ProductCopySectionProps) {
  return (
    <Card data-section="product-copy">
      <CardContent
        className={cn(
          "[&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground",
          "[&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
          "[&_p]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground",
          "[&_ul]:mb-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-4",
          "[&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-muted-foreground [&_li]:list-disc",
          "[&_strong]:font-semibold [&_strong]:text-foreground",
          className
        )}>
          {PRODUCT_COPY}
        </CardContent>
    </Card>
  );
}
