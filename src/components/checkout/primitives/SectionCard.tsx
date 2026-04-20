/**
 * SectionCard
 * -----------------------------------------------------------------------------
 * Shared wrapper for the form sections (Customer / Shipping / Payment). Renders
 * a `<section>` with a titled header separated from previous sections by a top
 * border, so the entire form column looks like a single card with labelled
 * groups inside it.
 *
 * Markers:
 *   - root             data-section="<section>" + data-slot="section-card"
 *   - title            data-slot="section-title"
 * -----------------------------------------------------------------------------
 */

import * as React from "react";

import { cn } from "@/lib/utils";

export interface SectionCardProps extends React.ComponentProps<"section"> {
  section: string;
  title: string;
}

export function SectionCard({
  section,
  title,
  className,
  children,
  ...rest
}: SectionCardProps) {
  return (
    <section
      data-section={section}
      data-slot="section-card"
      className={cn(
        "flex flex-col gap-3 border-t border-border pt-4 first:border-t-0 first:pt-0",
        className
      )}
      {...rest}
    >
      <h2
        data-slot="section-title"
        className="text-base font-semibold tracking-tight"
      >
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
