/**
 * CheckoutPage
 * -----------------------------------------------------------------------------
 * Top-level checkout page. Composes every section into a two-column layout
 * (form on the left, order summary on the right) that collapses to a single
 * column on narrow viewports.
 *
 * This component owns:
 *   - All customer + shipping form state (lifted from the individual cards).
 *   - The live `ConvesioPayComponent` handle, captured via
 *     `PaymentInfoCard.onComponentReady`, used to call `createToken()` on
 *     submit.
 *   - The payment status machine via `useCheckoutPayment`, which drives the
 *     `PaymentStatusDialog` through "processing" → "success" / "failed".
 *
 * Native HTML5 `required` attributes on every input stop the form from
 * submitting until the browser's built-in validation passes.
 *
 * All copy, images, and pricing come from `src/content/checkout.ts`.
 * All colors come from the `BRAND THEME` block in `src/index.css`.
 *
 * Markers:
 *   - root            data-page="checkout"
 *   - form column     data-region="form-stack"
 *   - summary column  data-region="summary"
 * -----------------------------------------------------------------------------
 */

import { useCallback, useRef, useState } from "react";

import {
  CustomerInfoCard,
  type CustomerInfoValue,
} from "@/components/checkout/CustomerInfoCard";
import { OrderSummaryCard } from "@/components/checkout/OrderSummaryCard";
import { PaymentInfoCard } from "@/components/checkout/PaymentInfoCard";
import { PaymentStatusDialog } from "@/components/checkout/PaymentStatusDialog";
import {
  ShippingInfoCard,
  type ShippingInfoValue,
} from "@/components/checkout/ShippingInfoCard";
import { checkoutContent } from "@/content/checkout";
import { useCheckoutPayment } from "@/hooks/useCheckoutPayment";

const INITIAL_CUSTOMER: CustomerInfoValue = {
  email: "",
  phoneNumber: "",
  phoneCountryCode: "",
};

const INITIAL_SHIPPING: ShippingInfoValue = {
  fullName: "",
  houseNumberOrName: "",
  street: "",
  city: "",
  stateOrProvince: "",
  zip: "",
  country: "",
};

export function CheckoutPage() {
  const [customer, setCustomer] = useState<CustomerInfoValue>(INITIAL_CUSTOMER);
  const [shipping, setShipping] = useState<ShippingInfoValue>(INITIAL_SHIPPING);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // The live ConvesioPay component, captured once the SDK mounts. Held in a
  // ref (not state) because we only need it at submit-time — re-rendering on
  // mount would cause unnecessary work.
  const componentRef = useRef<ConvesioPayComponent | null>(null);
  const handleComponentReady = useCallback((c: ConvesioPayComponent) => {
    componentRef.current = c;
  }, []);

  const { status, error, result, pay, reset } = useCheckoutPayment();

  const { page, product, customer: customerCopy, shipping: shippingCopy, payment, summary } =
    checkoutContent;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!componentRef.current) return;
    if (status === "processing") return;

    const address = {
      houseNumberOrName: shipping.houseNumberOrName,
      street: shipping.street,
      city: shipping.city,
      stateOrProvince: shipping.stateOrProvince,
      postalCode: shipping.zip,
      country: shipping.country,
    };

    await pay(componentRef.current, {
      email: customer.email,
      name: shipping.fullName,
      amount: summary.amountMinor,
      currency: summary.currency,
      phone: {
        number: customer.phoneNumber,
        countryCode: customer.phoneCountryCode,
      },
      billingAddress: address,
      shippingAddress: address,
    });
  };

  const isProcessing = status === "processing";

  return (
    <main data-page="checkout" className="min-h-dvh bg-background py-6 sm:py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-5xl px-4 sm:px-6"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          {/* #region SECTION: Form Stack */}
          <div
            data-region="form-stack"
            className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground"
          >
            <header data-section="page-header" className="flex flex-col gap-1">
              <h1
                data-slot="page-title"
                className="text-2xl font-bold tracking-tight"
              >
                {page.title}
              </h1>
              <p
                data-slot="page-subtitle"
                className="text-sm text-muted-foreground"
              >
                {page.subtitle}
              </p>
            </header>

            <CustomerInfoCard
              copy={customerCopy}
              value={customer}
              onChange={setCustomer}
            />
            <ShippingInfoCard
              copy={shippingCopy}
              value={shipping}
              onChange={setShipping}
            />
            <PaymentInfoCard
              copy={payment}
              customerEmail={customer.email || undefined}
              onValidityChange={setIsPaymentValid}
              onComponentReady={handleComponentReady}
            />
          </div>
          {/* #endregion */}

          {/* #region SECTION: Order Summary */}
          <div data-region="summary" className="lg:sticky lg:top-6">
            <OrderSummaryCard
              copy={summary}
              product={product}
              payDisabled={!isPaymentValid}
              payLoading={isProcessing}
            />
          </div>
          {/* #endregion */}
        </div>
      </form>

      <PaymentStatusDialog
        status={status}
        error={error}
        result={result}
        onClose={reset}
      />
    </main>
  );
}
