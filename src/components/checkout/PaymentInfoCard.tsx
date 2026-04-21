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

import { useEffect, useRef } from "react";

import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import { useConvesioPayCheckout } from "@/hooks/useConvesioPayCheckout";
import type { PaymentFormCopy } from "@/content/checkout";

export interface PaymentInfoCardProps {
  copy: PaymentFormCopy;
  customerEmail?: string;
  /** Fires whenever the ConvesioPay component reports a validity change. */
  onValidityChange?: (isValid: boolean) => void;
  /** Fires once the ConvesioPay SDK component has mounted. Gives the parent a
   *  handle to call `component.createToken()` at submit time. */
  onComponentReady?: (component: ConvesioPayComponent) => void;
}

export function PaymentInfoCard({
  copy,
  customerEmail,
  onValidityChange,
  onComponentReady,
}: PaymentInfoCardProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { status, error, isValid, component } = useConvesioPayCheckout(
    mountRef,
    {
      customerEmail,
      theme: "light",
    },
  );

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    if (component) onComponentReady?.(component);
  }, [component, onComponentReady]);

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
