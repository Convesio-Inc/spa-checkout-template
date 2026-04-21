/**
 * SecureBadge
 * -----------------------------------------------------------------------------
 * Small reassurance badge: lock icon + short label (e.g. "Secure Payment").
 * Used in multiple places on the checkout page — the centered notice under the
 * header, inside the order summary, and in the footer — so it forwards
 * `className` to let each call site tweak spacing / alignment without
 * duplicating the visual.
 *
 * Visual is intentionally muted: it's a trust signal, not a CTA. The lock icon
 * is tinted with the brand color so it still feels on-theme without competing
 * with the primary Pay Now button.
 *
 * Markers:
 *   - root    data-slot="secure-badge"
 *   - icon    data-slot="secure-badge-icon"
 *   - label   data-slot="secure-badge-label"
 * -----------------------------------------------------------------------------
 */

import * as React from "react";
import { LockIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface SecureBadgeProps extends React.ComponentProps<"div"> {
  label: string;
}

export function SecureBadge({
  label,
  className,
  ...rest
}: SecureBadgeProps) {
  return (
    <div
      data-slot="secure-badge"
      className={cn(
        "inline-flex items-center gap-2 text-xs font-medium text-muted-foreground",
        className
      )}
      {...rest}
    >
      <LockIcon
        data-slot="secure-badge-icon"
        aria-hidden="true"
        className="h-3.5 w-3.5 text-brand"
      />
      <span data-slot="secure-badge-label">{label}</span>
    </div>
  );
}
