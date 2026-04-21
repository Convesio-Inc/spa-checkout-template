/**
 * checkout.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for every user-visible string, price, and image used
 * by the checkout page. Swap values here to re-skin the page without touching
 * any JSX. All types are explicit so tooling (and humans) can reason about the
 * shape of each section.
 *
 * Structure:
 *   - PageCopy              Page heading + subtitle
 *   - BrandConfig           Brand identity: name + icon shown in the header/footer
 *   - ProductConfig         The item being sold: image, name, unit price
 *   - CustomerFormCopy      Customer Information card copy (email)
 *   - ShippingFormCopy      Shipping Information card copy (name/street/city/zip)
 *   - PaymentFormCopy       Payment Information card copy (card/expiry/cvv)
 *   - SummaryConfig         Order summary chrome: heading, totals, Pay Now CTA
 *   - FooterCopy            Optional suffix appended after the copyright line
 * -----------------------------------------------------------------------------
 */

export interface PageCopy {
  title: string;
  subtitle: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface BrandConfig {
  name: string;
  icon: ProductImage;
}

export interface ProductConfig {
  name: string;
  image: ProductImage;
  unitPrice: string;
  /** Optional secondary image shown at the right of the page header. Leave
   *  undefined to hide. */
  heroImage?: ProductImage;
}

export interface CustomerFormCopy {
  title: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneNumberLabel: string;
  phoneNumberPlaceholder: string;
  phoneCountryCodeLabel: string;
  phoneCountryCodePlaceholder: string;
}

export interface ShippingFormCopy {
  title: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  houseNumberOrNameLabel: string;
  houseNumberOrNamePlaceholder: string;
  streetAddressLabel: string;
  streetAddressPlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  stateOrProvinceLabel: string;
  stateOrProvincePlaceholder: string;
  zipLabel: string;
  zipPlaceholder: string;
  countryLabel: string;
  countryPlaceholder: string;
}

export interface PaymentFormCopy {
  title: string;
  cardNumberLabel: string;
  cardNumberPlaceholder: string;
  expiryLabel: string;
  expiryPlaceholder: string;
  cvvLabel: string;
  cvvPlaceholder: string;
}

export interface PriceLine {
  id: string;
  label: string;
  value: string;
}

export interface SummaryConfig {
  title: string;
  shipping: PriceLine;
  tax: PriceLine;
  total: PriceLine;
  ctaLabel: string;
  ctaFootnote: string;
  /** Total to charge, in minor units (e.g. 5695 = $56.95). This is the
   *  authoritative numeric source for the payment API call; the string
   *  `total.value` is presentation-only. */
  amountMinor: number;
  /** ISO 4217 currency code passed to ConvesioPay. */
  currency: string;
}

export interface FooterCopy {
  /** Optional text appended after the dynamic "© YYYY BrandName" line, e.g.
   *  "All rights reserved.". Leave undefined to show only the copyright line. */
  suffix?: string;
}

export interface SecurityCopy {
  /** Short label shown next to the lock icon (e.g. "Secure Payment"). Used by
   *  the centered notice under the header, inside the order summary, and in
   *  the footer — a single source of truth so the wording stays consistent. */
  label: string;
}

export interface GuaranteeCopy {
  /** Number shown inside the circular seal on the guarantee badge. */
  days: number;
  /** Short label under the number inside the seal (e.g. "DAYS"). */
  daysLabel: string;
  /** Bold headline shown next to the seal (e.g. "100% Money Back Guarantee"). */
  title: string;
  /** Supporting description explaining the guarantee. */
  description: string;
}

export interface CheckoutContent {
  page: PageCopy;
  brand: BrandConfig;
  product: ProductConfig;
  customer: CustomerFormCopy;
  shipping: ShippingFormCopy;
  payment: PaymentFormCopy;
  summary: SummaryConfig;
  security: SecurityCopy;
  guarantee: GuaranteeCopy;
  footer: FooterCopy;
}

export const checkoutContent: CheckoutContent = {
  page: {
    title: "Checkout",
    subtitle: "Simple dark mode checkout demo.",
  },

  brand: {
    name: "Convesio",
    icon: {
      src: "/store-logo.jpeg",
      alt: "Convesio logo",
    },
  },

  product: {
    name: "Vitamin Essentials Pack",
    image: {
      src: "/product-summary-image.jpeg",
      alt: "Vitamin Essentials Pack product photo",
    },
    unitPrice: "$49.00",
    // heroImage is optional — uncomment to show a thumbnail at the right of the header.
    heroImage: {
      src: "/product-image.jpeg",
      alt: "Vitamin Essentials Pack product photo",
    },
  },

  customer: {
    title: "Customer Information",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
    phoneNumberLabel: "Phone Number",
    phoneNumberPlaceholder: "5551234567",
    phoneCountryCodeLabel: "Country Code",
    phoneCountryCodePlaceholder: "+1",
  },

  shipping: {
    title: "Shipping Information",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Jane Doe",
    houseNumberOrNameLabel: "House Number / Name",
    houseNumberOrNamePlaceholder: "123",
    streetAddressLabel: "Street Address",
    streetAddressPlaceholder: "Main St",
    cityLabel: "City",
    cityPlaceholder: "Austin",
    stateOrProvinceLabel: "State / Province",
    stateOrProvincePlaceholder: "TX",
    zipLabel: "Zip Code",
    zipPlaceholder: "73301",
    countryLabel: "Country",
    countryPlaceholder: "US",
  },

  payment: {
    title: "Payment Information",
    cardNumberLabel: "Card Number",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiryLabel: "Expiration Date",
    expiryPlaceholder: "MM / YY",
    cvvLabel: "CVV",
    cvvPlaceholder: "CVV",
  },

  summary: {
    title: "Order Summary",
    shipping: { id: "shipping", label: "Shipping", value: "$7.95" },
    tax: { id: "tax", label: "Tax", value: "$0.00" },
    total: { id: "total", label: "Total", value: "$56.95" },
    ctaLabel: "Complete Checkout",
    ctaFootnote: "By clicking Complete Checkout, you agree to the Terms of Sale.",
    amountMinor: 5695,
    currency: "USD",
  },

  security: {
    label: "Secure Payment",
  },

  guarantee: {
    days: 60,
    daysLabel: "Days",
    title: "100% Money Back Guarantee",
    description:
      "If you're not satisfied within 60 days, we'll refund every penny. No questions asked.",
  },

  footer: {
    suffix: "All rights reserved.",
  },
};
