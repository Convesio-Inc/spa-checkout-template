/**
 * ThankYouHeader
 * -----------------------------------------------------------------------------
 * Full-width card at the top of the thank-you page. Renders the brand row and
 * a centered confirmation block with a checkmark icon.
 *
 * Markers:
 *   - root                    data-section="thank-you-header"
 *   - brand logo              data-slot="brand-icon"
 *   - brand name              data-slot="brand-name"
 *   - confirmation icon wrap  data-slot="confirmation-icon"
 *   - heading                 data-slot="confirmation-heading"
 *   - subheading              data-slot="confirmation-subheading"
 * -----------------------------------------------------------------------------
 */

import { CheckCircle2Icon } from "lucide-react";

import type { BrandConfig } from "@/content/checkout";

export interface ThankYouHeaderProps {
  brand: BrandConfig;
  heading: string;
  subheading: string;
}

export function ThankYouHeader({
  brand,
  heading,
  subheading,
}: ThankYouHeaderProps) {
  return (
    <header
      data-section="thank-you-header"
      className="flex flex-col rounded-xl border border-border bg-card p-5 text-card-foreground"
    >
      <div className="flex items-center justify-between">
        <img
          data-slot="brand-icon"
          src={brand.icon.src}
          alt={brand.icon.alt}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <span
          data-slot="brand-name"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-brand"
        >
          {brand.name}
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 pb-2 text-center">
        <div
          data-slot="confirmation-icon"
          aria-hidden="true"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10"
        >
          <CheckCircle2Icon className="h-8 w-8 text-emerald-500" />
        </div>
        <h1
          data-slot="confirmation-heading"
          className="text-2xl font-bold tracking-tight text-foreground"
        >
          {heading}
        </h1>
        <p
          data-slot="confirmation-subheading"
          className="text-sm text-muted-foreground"
        >
          {subheading}
        </p>
      </div>
    </header>
  );
}
