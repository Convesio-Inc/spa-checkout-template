/**
 * ShippingInfoCard
 * -----------------------------------------------------------------------------
 * Shipping address form (full name, street, city, zip). No validation, no
 * submission side effects.
 *
 * Content source: `checkoutContent.shipping`
 *
 * Markers:
 *   - root                  data-section="shipping-info"
 *   - field data attributes  data-field="full-name" | "street" | "city" | "zip"
 * -----------------------------------------------------------------------------
 */

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import type { ShippingFormCopy } from "@/content/checkout";

export interface ShippingInfoCardProps {
  copy: ShippingFormCopy;
}

export function ShippingInfoCard({ copy }: ShippingInfoCardProps) {
  return (
    <SectionCard section="shipping-info" title={copy.title}>
      <FieldGroup>
        <Field data-field="full-name">
          <FieldLabel htmlFor="ship-full-name">{copy.fullNameLabel}</FieldLabel>
          <Input
            id="ship-full-name"
            autoComplete="name"
            placeholder={copy.fullNamePlaceholder}
          />
        </Field>

        <Field data-field="street">
          <FieldLabel htmlFor="ship-street">
            {copy.streetAddressLabel}
          </FieldLabel>
          <Input
            id="ship-street"
            autoComplete="address-line1"
            placeholder={copy.streetAddressPlaceholder}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field data-field="city">
            <FieldLabel htmlFor="ship-city">{copy.cityLabel}</FieldLabel>
            <Input
              id="ship-city"
              autoComplete="address-level2"
              placeholder={copy.cityPlaceholder}
            />
          </Field>
          <Field data-field="zip">
            <FieldLabel htmlFor="ship-zip">{copy.zipLabel}</FieldLabel>
            <Input
              id="ship-zip"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder={copy.zipPlaceholder}
            />
          </Field>
        </div>
      </FieldGroup>
    </SectionCard>
  );
}
