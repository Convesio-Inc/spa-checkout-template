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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SectionCardProps extends React.ComponentProps<"div"> {
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
    <Card
      data-section={section}
      data-slot="section-card"
      className={cn(className)}
      {...rest}
    >
      <CardHeader>
        <CardTitle
          data-slot="section-title"
          className="text-base font-semibold tracking-tight"
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">{children}</div>
      </CardContent>
    </Card>
  );
}
