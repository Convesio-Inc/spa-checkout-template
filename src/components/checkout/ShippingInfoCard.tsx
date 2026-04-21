/**
 * ShippingInfoCard
 * -----------------------------------------------------------------------------
 * Shipping address form fully matching the ConvesioPay `shippingAddress`
 * payload shape: full name, house number/name, street, city, state/province,
 * zip, and country. The card is fully controlled and every `Input` is
 * `required` so the browser blocks `<form>` submission until they are filled.
 *
 * Content source: `checkoutContent.shipping`
 *
 * Markers:
 *   - root                  data-section="shipping-info"
 *   - field data attributes  data-field="full-name" | "house-number" |
 *                            "street" | "city" | "state" | "zip" | "country"
 * -----------------------------------------------------------------------------
 */

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import type { ShippingFormCopy } from "@/content/checkout";

export interface ShippingInfoValue {
  fullName: string;
  houseNumberOrName: string;
  street: string;
  city: string;
  stateOrProvince: string;
  zip: string;
  country: string;
}

export interface ShippingInfoCardProps {
  copy: ShippingFormCopy;
  value: ShippingInfoValue;
  onChange: (next: ShippingInfoValue) => void;
}

export function ShippingInfoCard({
  copy,
  value,
  onChange,
}: ShippingInfoCardProps) {
  const set =
    (key: keyof ShippingInfoValue) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: event.target.value });

  return (
    <SectionCard section="shipping-info" title={copy.title}>
      <FieldGroup>
        <Field data-field="full-name">
          <FieldLabel htmlFor="ship-full-name">{copy.fullNameLabel}</FieldLabel>
          <Input
            id="ship-full-name"
            autoComplete="name"
            placeholder={copy.fullNamePlaceholder}
            required
            value={value.fullName}
            onChange={set("fullName")}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(8rem,1fr)_2fr]">
          <Field data-field="house-number">
            <FieldLabel htmlFor="ship-house-number">
              {copy.houseNumberOrNameLabel}
            </FieldLabel>
            <Input
              id="ship-house-number"
              autoComplete="address-line1"
              placeholder={copy.houseNumberOrNamePlaceholder}
              required
              value={value.houseNumberOrName}
              onChange={set("houseNumberOrName")}
            />
          </Field>
          <Field data-field="street">
            <FieldLabel htmlFor="ship-street">
              {copy.streetAddressLabel}
            </FieldLabel>
            <Input
              id="ship-street"
              autoComplete="address-line2"
              placeholder={copy.streetAddressPlaceholder}
              required
              value={value.street}
              onChange={set("street")}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field data-field="city">
            <FieldLabel htmlFor="ship-city">{copy.cityLabel}</FieldLabel>
            <Input
              id="ship-city"
              autoComplete="address-level2"
              placeholder={copy.cityPlaceholder}
              required
              value={value.city}
              onChange={set("city")}
            />
          </Field>
          <Field data-field="state">
            <FieldLabel htmlFor="ship-state">
              {copy.stateOrProvinceLabel}
            </FieldLabel>
            <Input
              id="ship-state"
              autoComplete="address-level1"
              placeholder={copy.stateOrProvincePlaceholder}
              required
              value={value.stateOrProvince}
              onChange={set("stateOrProvince")}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field data-field="zip">
            <FieldLabel htmlFor="ship-zip">{copy.zipLabel}</FieldLabel>
            <Input
              id="ship-zip"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder={copy.zipPlaceholder}
              required
              value={value.zip}
              onChange={set("zip")}
            />
          </Field>
          <Field data-field="country">
            <FieldLabel htmlFor="ship-country">{copy.countryLabel}</FieldLabel>
            <Input
              id="ship-country"
              autoComplete="country"
              placeholder={copy.countryPlaceholder}
              required
              maxLength={2}
              value={value.country}
              onChange={set("country")}
            />
          </Field>
        </div>
      </FieldGroup>
    </SectionCard>
  );
}
