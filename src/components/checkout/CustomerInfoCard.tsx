/**
 * CustomerInfoCard
 * -----------------------------------------------------------------------------
 * Collects the customer's email. All inputs are uncontrolled — no validation,
 * no submission side effects.
 *
 * Content source: `checkoutContent.customer`
 *
 * Markers:
 *   - root          data-section="customer-info"
 *   - email field   data-field="email"
 * -----------------------------------------------------------------------------
 */

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import type { CustomerFormCopy } from "@/content/checkout";

export interface CustomerInfoCardProps {
  copy: CustomerFormCopy;
}

export function CustomerInfoCard({ copy }: CustomerInfoCardProps) {
  return (
    <SectionCard section="customer-info" title={copy.title}>
      <FieldGroup>
        <Field data-field="email">
          <FieldLabel htmlFor="customer-email">{copy.emailLabel}</FieldLabel>
          <Input
            id="customer-email"
            type="email"
            autoComplete="email"
            placeholder={copy.emailPlaceholder}
          />
        </Field>
      </FieldGroup>
    </SectionCard>
  );
}
