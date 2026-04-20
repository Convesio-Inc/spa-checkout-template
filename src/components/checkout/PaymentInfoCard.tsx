/**
 * PaymentInfoCard
 * -----------------------------------------------------------------------------
 * Hosts the ConvesioPay checkout component (a PCI-compliant iframe widget that
 * tokenizes card data on ConvesioPay's side). The SDK is initialized + mounted
 * exactly once via the `useConvesioPayCheckout` hook; the public-safe API key
 * and client key are fetched once from the `/config` worker endpoint and
 * cached at module scope.
 *
 * Content source: `checkoutContent.payment`
 *
 * Markers:
 *   - root                        data-section="payment-info"
 *   - mount container             data-slot="cpay-mount"
 *   - loading placeholder         data-slot="cpay-loading"
 *   - error message               data-slot="cpay-error"
 * -----------------------------------------------------------------------------
 */

import { useRef } from "react";

import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import { useConvesioPayCheckout } from "@/hooks/useConvesioPayCheckout";
import type { PaymentFormCopy } from "@/content/checkout";

export interface PaymentInfoCardProps {
  copy: PaymentFormCopy;
  customerEmail?: string;
}

export function PaymentInfoCard({ copy, customerEmail }: PaymentInfoCardProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { status, error } = useConvesioPayCheckout(mountRef, {
    customerEmail,
    theme: "dark",
  });

  return (
    <SectionCard section="payment-info" title={copy.title}>
      <div
        ref={mountRef}
        data-slot="cpay-mount"
        id="cpay-checkout-component"
        className="min-h-[220px]"
      />

      {status === "loading" && (
        <p
          data-slot="cpay-loading"
          className="text-sm text-muted-foreground"
          aria-live="polite"
        >
          Loading secure payment form…
        </p>
      )}

      {status === "error" && (
        <p
          data-slot="cpay-error"
          role="alert"
          className="text-sm text-destructive"
        >
          {error?.message ?? "Could not load the payment form."}
        </p>
      )}
    </SectionCard>
  );
}
