/**
 * ThankYouHeader
 * -----------------------------------------------------------------------------
 * Full-width card at the top of the thank-you page. Renders the brand row and
 * a centered confirmation block.
 *
 * The confirmation block adapts to the checkout state:
 *   - "succeeded"           green check icon + confirmed heading/subheading.
 *   - "pending"/"verifying" subtle muted spinner + "finalising" copy. Used
 *                           while the worker re-checks the payment status
 *                           (e.g. async webhook review). Keeps the same card
 *                           chrome so the layout doesn't jump when the
 *                           terminal status comes in.
 *
 * Markers:
 *   - root                    data-section="thank-you-header"
 *   - brand logo              data-slot="brand-icon"
 *   - brand name              data-slot="brand-name"
 *   - confirmation icon wrap  data-slot="confirmation-icon"
 *   - heading                 data-slot="confirmation-heading"
 *   - subheading              data-slot="confirmation-subheading"
 *   - status attribute        data-status="succeeded|pending|verifying"
 * -----------------------------------------------------------------------------
 */

import { CheckCircle2Icon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { BrandConfig } from "@/content/checkout";

export type ThankYouHeaderStatus = "verifying" | "pending" | "succeeded";

export interface ThankYouHeaderProps {
  brand: BrandConfig;
  heading: string;
  subheading: string;
  /** Defaults to "succeeded" for backwards compatibility. */
  status?: ThankYouHeaderStatus;
  /** Optional override for the heading when status !== "succeeded". */
  pendingHeading?: string;
  /** Optional override for the subheading when status !== "succeeded". */
  pendingSubheading?: string;
}

const DEFAULT_PENDING_HEADING = "Finalising your order…";
const DEFAULT_PENDING_SUBHEADING =
  "Your payment is going through a final review. This page will update automatically — no need to refresh.";
const DEFAULT_VERIFYING_SUBHEADING =
  "Just a moment while we confirm your order.";

export function ThankYouHeader({
  brand,
  heading,
  subheading,
  status = "succeeded",
  pendingHeading,
  pendingSubheading,
}: ThankYouHeaderProps) {
  const isSucceeded = status === "succeeded";

  const resolvedHeading = isSucceeded
    ? heading
    : (pendingHeading ?? DEFAULT_PENDING_HEADING);

  const resolvedSubheading = isSucceeded
    ? subheading
    : (pendingSubheading ??
      (status === "verifying"
        ? DEFAULT_VERIFYING_SUBHEADING
        : DEFAULT_PENDING_SUBHEADING));

  return (
    <>
      <Card data-section="thank-you-brand-header">
        <CardContent className="flex items-center justify-between">
          <img
            data-slot="brand-icon"
            src={brand.icon.src}
            alt={brand.icon.alt}
            className="h-9 w-9 shrink-0 rounded-lg border border-brand/40 object-cover"
          />
          <span
            data-slot="brand-name"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-brand"
          >
            {brand.name}
          </span>
        </CardContent>
      </Card>

      <Card data-section="thank-you-header" data-status={status}>
        <CardContent className="flex flex-col items-center gap-3 pb-2 text-center">
          <div
            data-slot="confirmation-icon"
            aria-hidden="true"
            className={
              isSucceeded
                ? "flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10"
                : "flex h-14 w-14 items-center justify-center rounded-full bg-muted"
            }
          >
            {isSucceeded ? (
              <CheckCircle2Icon className="h-8 w-8 text-emerald-500" />
            ) : (
              <Spinner className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          <h1
            data-slot="confirmation-heading"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            {resolvedHeading}
          </h1>
          <p
            data-slot="confirmation-subheading"
            className="text-sm text-muted-foreground"
          >
            {resolvedSubheading}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
