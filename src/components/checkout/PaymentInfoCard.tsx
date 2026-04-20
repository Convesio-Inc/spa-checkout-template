/**
 * PaymentInfoCard
 * -----------------------------------------------------------------------------
 * Credit card fields (card number, expiration, CVV). All inputs are
 * uncontrolled — no validation, no submission side effects.
 *
 * Content source: `checkoutContent.payment`
 *
 * Markers:
 *   - root                  data-section="payment-info"
 *   - individual fields      data-field="card-number" | "expiry" | "cvv"
 * -----------------------------------------------------------------------------
 */

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import type { PaymentFormCopy } from "@/content/checkout";

export interface PaymentInfoCardProps {
  copy: PaymentFormCopy;
}

export function PaymentInfoCard({ copy }: PaymentInfoCardProps) {
  return (
    <SectionCard section="payment-info" title={copy.title}>
      <FieldGroup>
        <Field data-field="card-number">
          <FieldLabel htmlFor="card-number">{copy.cardNumberLabel}</FieldLabel>
          <Input
            id="card-number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder={copy.cardNumberPlaceholder}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field data-field="expiry">
            <FieldLabel htmlFor="card-expiry">{copy.expiryLabel}</FieldLabel>
            <Input
              id="card-expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder={copy.expiryPlaceholder}
            />
          </Field>
          <Field data-field="cvv">
            <FieldLabel htmlFor="card-cvv">{copy.cvvLabel}</FieldLabel>
            <Input
              id="card-cvv"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder={copy.cvvPlaceholder}
            />
          </Field>
        </div>
      </FieldGroup>
    </SectionCard>
  );
}
