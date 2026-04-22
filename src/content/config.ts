/**
 * config.ts
 * -----------------------------------------------------------------------------
 * Single source of truth for every user-visible string, price, and image used
 * by the checkout page. Swap values here to re-skin the page without touching
 * any JSX. All types are explicit so tooling (and humans) can reason about the
 * shape of each section.
 *
 * Structure:
 *   - BrandConfig           Brand identity: name + icon shown in the header/footer
 *   - ProductConfig         The item being sold: image, name, unit price, description
 *   - CustomerFormCopy      Customer Information card copy (email)
 *   - ShippingFormCopy      Shipping Information card copy (name/street/city/zip)
 *   - PaymentFormCopy       Payment Information card copy (card/expiry/cvv)
 *   - SummaryConfig         Order summary chrome: heading, totals, Pay Now CTA
 *   - FooterCopy            Optional suffix appended after the copyright line
 * -----------------------------------------------------------------------------
 */
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
  /** Current selling price shown to the customer. */
  salePrice: string;
  /** Original / compare-at price shown with a strikethrough. Omit to hide. */
  regularPrice?: string;
  /** Short description shown below the product name in the header. */
  description?: string;
  /** Optional secondary image shown at the right of the page header. Leave
   *  undefined to hide. */
  heroImage?: ProductImage;
  /** Short benefit bullets shown on the product page. */
  benefits?: string[];
  /** Trusted HTML string rendered verbatim on the product page body. */
  productCopy?: string;
}

export interface ProductPageCopy {
  ctaLabel: string;
}

export interface HeaderCopy {
  topBar: {
    badge: string;
    messages: [string, string];
  };
}

export interface FormPanelCopy {
  title: string;
  subtitle: string;
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

export interface CountryOption {
  /** ISO-3166-1 alpha-2 code (e.g. "US"). */
  value: string;
  /** Human-readable name (e.g. "United States"). */
  label: string;
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
  countries: CountryOption[];
}

export interface PaymentFormCopy {
  title: string;
  cardNumberLabel: string;
  cardNumberPlaceholder: string;
  expiryLabel: string;
  expiryPlaceholder: string;
  cvvLabel: string;
  cvvPlaceholder: string;
  loadingMessage: string;
  errorFallbackMessage: string;
}

export interface PriceLine {
  id: string;
  label: string;
  value: string;
}

export interface SummaryConfig {
  title: string;
  includedProductsTitle: string;
  includedProductSuffix?: string;
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

export interface TimerConfig {
  /** Number of days in the initial countdown value. */
  days: number;
  /** Number of minutes in the initial countdown value. */
  minutes: number;
  /** Number of seconds in the initial countdown value. */
  seconds: number;
  /** Lead text shown before the countdown timer badge. */
  leadText: string;
  /** Supporting text shown after the countdown timer badge. */
  helperText: string;
}

export interface FooterCopy {
  /** Primary footer line (e.g. copyright/legal text). */
  primaryLine: string;
  /** Secondary footer line (e.g. security assurance text). */
  secondaryLine: string;
}

export interface ThankYouStep {
  id: string;
  title: string;
  description: string;
}

export interface ThankYouCopy {
  heading: string;
  subheading: string;
  confirmation: { title: string };
  nextSteps: { title: string; steps: ThankYouStep[] };
  receipt: {
    title: string;
    backToProductLabel: string;
    backToProductHref: string;
    guaranteeNote: string;
  };
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
  brand: BrandConfig;
  product: ProductConfig;
  productPage: ProductPageCopy;
  header: HeaderCopy;
  formPanel: FormPanelCopy;
  customer: CustomerFormCopy;
  shipping: ShippingFormCopy;
  payment: PaymentFormCopy;
  summary: SummaryConfig;
  security: SecurityCopy;
  guarantee: GuaranteeCopy;
  timer: TimerConfig;
  footer: FooterCopy;
  thankYou: ThankYouCopy;
}

export const checkoutContent: CheckoutContent = {
  brand: {
    name: "BioVerve",
    icon: {
      src: "/store-logo.jpeg",
      alt: "BioVerve logo",
    },
  },

  product: {
    name: "Vitamin Essentials Pack",
    description:
      "A daily blend of 12 essential vitamins to support energy, immunity, and overall wellness.",
    image: {
      src: "/product-summary-image.jpeg",
      alt: "Vitamin Essentials Pack product photo",
    },
    salePrice: "$49.00",
    regularPrice: "$79.00",
    heroImage: {
      src: "/product-image.jpeg",
      alt: "Vitamin Essentials Pack product photo",
    },
    benefits: [
      "12 essential vitamins in one daily capsule",
      "Supports immune function and sustained energy",
      "Third-party tested for purity and potency",
      "Vegan-friendly, non-GMO, no artificial fillers",
      "Backed by our 60-day money-back guarantee",
    ],
    productCopy: `<h2>Why Vitamin Essentials Pack?</h2>
<p>Most people don't get everything they need from diet alone. Vitamin Essentials Pack was formulated to fill those gaps — delivering a precise daily dose of the 12 vitamins your body relies on most, in forms it can actually absorb.</p>
<h3>Key Ingredients</h3>
<ul>
  <li><strong>Vitamin D3</strong> — Supports bone density and immune resilience, especially in low-sunlight months.</li>
  <li><strong>Vitamin B12</strong> — Drives energy metabolism and reduces fatigue at the cellular level.</li>
  <li><strong>Vitamin C</strong> — A potent antioxidant that powers immune response and collagen synthesis.</li>
  <li><strong>Vitamin K2</strong> — Works synergistically with D3 to direct calcium to bones, not arteries.</li>
  <li><strong>Vitamins B1, B2, B3, B5, B6, B7, B9, E</strong> — The remaining eight complete the spectrum for metabolism, skin health, and neurological support.</li>
</ul>
<h3>Quality You Can Trust</h3>
<p>Every batch is independently tested by a third-party lab for potency and absence of heavy metals, allergens, and contaminants. Our capsules are 100% vegan, non-GMO, and free from artificial colours, flavours, and fillers.</p>
<h3>How to Use</h3>
<p>Take one capsule daily with a meal. Consistent daily use is key — most customers notice a difference in energy and focus within 2–4 weeks.</p>`,
  },

  productPage: {
    ctaLabel: "Proceed to Checkout",
  },

  header: {
    topBar: {
      badge: "Secure Checkout",
      messages: [
        "All transactions are secure and encrypted",
        "Need Help? 1-800-390-6035",
      ],
    },
  },

  formPanel: {
    title: "Secure Checkout",
    subtitle: "Complete your details below to place your order.",
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
    countryPlaceholder: "Select a country",
    countries: [
      { value: "US", label: "United States" },
      { value: "CA", label: "Canada" },
      { value: "GB", label: "United Kingdom" },
      { value: "AU", label: "Australia" },
    ],
  },

  payment: {
    title: "Payment Information",
    cardNumberLabel: "Card Number",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiryLabel: "Expiration Date",
    expiryPlaceholder: "MM / YY",
    cvvLabel: "CVV",
    cvvPlaceholder: "CVV",
    loadingMessage: "Loading secure payment form...",
    errorFallbackMessage: "Could not load the payment form.",
  },

  summary: {
    title: "Cart Summary",
    includedProductsTitle: "Included Products",
    includedProductSuffix: "",
    shipping: { id: "shipping", label: "Shipping", value: "$7.95" },
    tax: { id: "tax", label: "Tax", value: "$0.00" },
    total: { id: "total", label: "Total", value: "$56.95" },
    ctaLabel: "Pay Now",
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

  timer: {
    days: 0,
    minutes: 14,
    seconds: 59,
    leadText: "Offer reserved for:",
    helperText: "Complete checkout now to keep your bonus.",
  },

  footer: {
    primaryLine: "All rights reserved.",
    secondaryLine: "Secure checkout powered by ConvesioPay.",
  },

  thankYou: {
    heading: "Order Confirmed!",
    subheading: "Your order has been received and is being processed.",
    confirmation: { title: "Order Summary" },
    nextSteps: {
      title: "What Happens Next",
      steps: [
        {
          id: "email",
          title: "Check your inbox",
          description:
            "A confirmation email with your order details has been sent to you.",
        },
        {
          id: "processing",
          title: "Order processing",
          description:
            "Our team is preparing your order and getting it ready to ship.",
        },
        {
          id: "delivery",
          title: "Delivery",
          description:
            "Your package will be on its way soon. Expect delivery within 5–7 business days.",
        },
      ],
    },
    receipt: {
      title: "Receipt Summary",
      backToProductLabel: "Back to Product Page",
      backToProductHref: "/product",
      guaranteeNote: "Your 60-day return window starts from the purchase date.",
    },
  },
};
