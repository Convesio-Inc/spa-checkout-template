/**
 * SectionCard
 * -----------------------------------------------------------------------------
 * Shared wrapper for the form sections (Customer / Shipping / Payment). Renders
 * a `<section>` as a self-contained card with a titled header, so each section
 * in the form column is visually distinct.
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
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-5 text-card-foreground",
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
