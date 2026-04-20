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
 *   - ProductConfig         The item being sold: image, name, unit price
 *   - CustomerFormCopy      Customer Information card copy (email)
 *   - ShippingFormCopy      Shipping Information card copy (name/street/city/zip)
 *   - PaymentFormCopy       Payment Information card copy (card/expiry/cvv)
 *   - SummaryConfig         Order summary chrome: heading, totals, Pay Now CTA
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

export interface ProductConfig {
  name: string;
  image: ProductImage;
  unitPrice: string;
}

export interface CustomerFormCopy {
  title: string;
  emailLabel: string;
  emailPlaceholder: string;
}

export interface ShippingFormCopy {
  title: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  streetAddressLabel: string;
  streetAddressPlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  zipLabel: string;
  zipPlaceholder: string;
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
}

export interface CheckoutContent {
  page: PageCopy;
  product: ProductConfig;
  customer: CustomerFormCopy;
  shipping: ShippingFormCopy;
  payment: PaymentFormCopy;
  summary: SummaryConfig;
}

export const checkoutContent: CheckoutContent = {
  page: {
    title: "Checkout",
    subtitle: "Simple dark mode checkout demo.",
  },

  product: {
    name: "Vitamin Essentials Pack",
    image: {
      src: "/product-summary-image.jpeg",
      alt: "Vitamin Essentials Pack product photo",
    },
    unitPrice: "$49.00",
  },

  customer: {
    title: "Customer Information",
    emailLabel: "Email Address",
    emailPlaceholder: "you@example.com",
  },

  shipping: {
    title: "Shipping Information",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Jane Doe",
    streetAddressLabel: "Street Address",
    streetAddressPlaceholder: "123 Main St",
    cityLabel: "City",
    cityPlaceholder: "Austin",
    zipLabel: "Zip Code",
    zipPlaceholder: "73301",
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
    ctaLabel: "Pay Now",
    ctaFootnote: "By clicking Pay Now, you agree to the Terms of Sale.",
  },
};
