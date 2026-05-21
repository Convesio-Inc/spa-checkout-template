/**
 * ShippingInfoCard
 * -----------------------------------------------------------------------------
 * Shipping address form fully matching the ConvesioPay `shippingAddress`
 * payload shape: full name, house number/name, street, city, state/province,
 * zip, and country. The card is fully controlled and every text `Input` is
 * `required` so the browser blocks `<form>` submission until they are filled.
 * Country is chosen from a `Select`.
 *
 * Markers:
 *   - root                  data-section="shipping-info"
 *   - field data attributes  data-field="full-name" | "house-number" |
 *                            "street" | "city" | "state" | "zip" | "country"
 * -----------------------------------------------------------------------------
 */

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
] as const;

export interface ShippingInfoValue {
  fullName: string;
  houseNumberOrName: string;
  street: string;
  city: string;
  stateOrProvince: string;
  zip: string;
  country: string;
}

export interface ShippingInfoProps {
  value: ShippingInfoValue;
  onChange: (next: ShippingInfoValue) => void;
}

export function ShippingInfo({
  value,
  onChange,
}: ShippingInfoProps) {
  const set =
    (key: keyof ShippingInfoValue) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: event.target.value });

  return (
      <FieldGroup>
        <Field data-field="full-name">
          <FieldLabel htmlFor="ship-full-name">Full Name</FieldLabel>
          <Input
            id="ship-full-name"
            autoComplete="name"
            placeholder="Jane Doe"
            required
            value={value.fullName}
            onChange={set("fullName")}
          />
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(8rem,1fr)_2fr]">
          <Field data-field="house-number">
            <FieldLabel htmlFor="ship-house-number">
              House Number / Name
            </FieldLabel>
            <Input
              id="ship-house-number"
              autoComplete="address-line1"
              placeholder="123"
              required
              value={value.houseNumberOrName}
              onChange={set("houseNumberOrName")}
            />
          </Field>
          <Field data-field="street">
            <FieldLabel htmlFor="ship-street">
              Street Address
            </FieldLabel>
            <Input
              id="ship-street"
              autoComplete="address-line2"
              placeholder="Main St"
              required
              value={value.street}
              onChange={set("street")}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field data-field="city">
            <FieldLabel htmlFor="ship-city">City</FieldLabel>
            <Input
              id="ship-city"
              autoComplete="address-level2"
              placeholder="Austin"
              required
              value={value.city}
              onChange={set("city")}
            />
          </Field>
          <Field data-field="state">
            <FieldLabel htmlFor="ship-state">
              State / Province
            </FieldLabel>
            <Input
              id="ship-state"
              autoComplete="address-level1"
              placeholder="TX"
              required
              value={value.stateOrProvince}
              onChange={set("stateOrProvince")}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field data-field="zip">
            <FieldLabel htmlFor="ship-zip">Zip Code</FieldLabel>
            <Input
              id="ship-zip"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="73301"
              required
              value={value.zip}
              onChange={set("zip")}
            />
          </Field>
          <Field data-field="country">
            <FieldLabel htmlFor="ship-country">Country</FieldLabel>
            <Select
              value={value.country || undefined}
              onValueChange={(next) => onChange({ ...value, country: next })}
            >
              <SelectTrigger
                id="ship-country"
                className="w-full"
                aria-label="Country"
              >
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </FieldGroup>
  );
}
