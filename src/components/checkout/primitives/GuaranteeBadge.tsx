/**
 * GuaranteeBadge
 * -----------------------------------------------------------------------------
 * Money-back guarantee reassurance block rendered at the bottom of the order
 * summary card. A solid brand-colored circular medallion on the left holds
 * the day count, paired with a short headline + description on the right.
 * The medallion has no border, ring, or shadow — the flat fill alone is the
 * visual anchor — and the surrounding tile uses a softly tinted background
 * so the whole block reads as a trust signal without competing with the
 * primary Pay Now button.
 *
 * Content is fully driven by `checkoutContent.guarantee` — swap the copy (or
 * the `days` number) without touching this component.
 *
 * Markers:
 *   - root           data-slot="guarantee-badge"
 *   - medallion      data-slot="guarantee-medallion"
 *   - days number    data-slot="guarantee-days"
 *   - days label     data-slot="guarantee-days-label"
 *   - title          data-slot="guarantee-title"
 *   - description    data-slot="guarantee-description"
 * -----------------------------------------------------------------------------
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface GuaranteeBadgeProps extends React.ComponentProps<"div"> {
  days: number;
  daysLabel: string;
  title: string;
  description: string;
}

export function GuaranteeBadge({
  days,
  daysLabel,
  title,
  description,
  className,
  ...rest
}: GuaranteeBadgeProps) {
  return (
    <div
      data-slot="guarantee-badge"
      className={cn(
        "flex items-center gap-4 rounded-xl bg-brand/5 p-4",
        className
      )}
      {...rest}
    >
      <div
        data-slot="guarantee-medallion"
        aria-hidden="true"
        className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full bg-brand leading-none text-brand-foreground"
      >
        <span
          data-slot="guarantee-days"
          className="text-xl font-extrabold tracking-tight"
        >
          {days}
        </span>
        <span
          data-slot="guarantee-days-label"
          className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] opacity-90"
        >
          {daysLabel}
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <p
          data-slot="guarantee-title"
          className="text-sm font-bold tracking-tight text-foreground"
        >
          {title}
        </p>
        <p
          data-slot="guarantee-description"
          className="text-xs leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
