/**
 * CustomerInfoCard
 * -----------------------------------------------------------------------------
 * Collects the customer's email and phone number (number + country code). The
 * card is fully controlled: the parent owns state and every `Input` is
 * `required` so the browser blocks `<form>` submission until they are filled.
 *
 * Markers:
 *   - root                  data-section="customer-info"
 *   - email field           data-field="email"
 *   - phone country field   data-field="phone-country-code"
 *   - phone number field    data-field="phone-number"
 * -----------------------------------------------------------------------------
 */

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export interface CustomerInfoValue {
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
}

export interface CustomerInfoCardProps {
  value: CustomerInfoValue;
  onChange: (next: CustomerInfoValue) => void;
}

export function CustomerInfo({
  value,
  onChange,
}: CustomerInfoCardProps) {
  const set =
    (key: keyof CustomerInfoValue) =>
      (event: React.ChangeEvent<HTMLInputElement>) =>
        onChange({ ...value, [key]: event.target.value });

  return (
    <FieldGroup>
      <Field data-field="email">
        <FieldLabel htmlFor="customer-email">Email Address</FieldLabel>
        <Input
          id="customer-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={value.email}
          onChange={set("email")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[auto_1fr]">
        <Field data-field="phone-country-code">
          <FieldLabel htmlFor="customer-phone-country-code">
            Country Code
          </FieldLabel>
          <Input
            id="customer-phone-country-code"
            type="text"
            autoComplete="tel-country-code"
            inputMode="tel"
            placeholder="+1"
            required
            className="sm:w-24"
            value={value.phoneCountryCode}
            onChange={set("phoneCountryCode")}
          />
        </Field>
        <Field data-field="phone-number">
          <FieldLabel htmlFor="customer-phone-number">
            Phone Number
          </FieldLabel>
          <Input
            id="customer-phone-number"
            type="tel"
            autoComplete="tel-national"
            inputMode="tel"
            placeholder="5551234567"
            required
            value={value.phoneNumber}
            onChange={set("phoneNumber")}
          />
        </Field>
      </div>
    </FieldGroup>
  );
}
