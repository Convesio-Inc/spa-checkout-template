/**
 * PriceRow
 * -----------------------------------------------------------------------------
 * A single label/value row used in the Order Summary card.
 *
 * Markers:
 *   - root    data-slot="price-row", data-row-id=<id>
 *   - value   data-slot="price-value"
 * -----------------------------------------------------------------------------
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import type { PriceLine } from "@/content/checkout";

export interface PriceRowProps extends React.ComponentProps<"div"> {
  line: PriceLine;
  labelClassName?: string;
  valueClassName?: string;
  href?: string;
}

export function PriceRow({
  line,
  className,
  labelClassName,
  valueClassName,
  href,
  ...rest
}: PriceRowProps) {
  return (
    <div
      data-slot="price-row"
      data-row-id={line.id}
      className={cn(
        "flex items-baseline justify-between gap-3 text-sm",
        className
      )}
      {...rest}
    >
      {href ? (
        <a
          href={href}
          className={cn("text-foreground underline", labelClassName)}
        >
          {line.label}
        </a>
      ) : (
        <span className={cn("text-foreground", labelClassName)}>
          {line.label}
        </span>
      )}
      <span
        data-slot="price-value"
        className={cn("font-semibold text-foreground", valueClassName)}
      >
        {line.value}
      </span>
    </div>
  );
}
