/**
 * ThankYouPage
 * -----------------------------------------------------------------------------
 * Landing page after the checkout redirects. Reads the `?token=` JWT that the
 * worker signed on success/pending, verifies it server-side, and drives a
 * state machine via `useThankYouPayment`:
 *
 *   - "verifying"  Amber "Processing Payment" promo banner with a spinner +
 *                  matching "Processing Your Payment" main-card copy, while
 *                  the worker verifies the token.
 *   - "pending"    Same promo banner and main-card copy as "verifying" — the
 *                  hook polls `/poll-payment` every 5s until the upstream
 *                  status flips to succeeded or failed. The layout doesn't
 *                  jump on transition; banner + card copy swap in place.
 *   - "succeeded"  Green "Order Confirmed" promo banner + "Thank You for
 *                  Your Order" main-card copy, plus order details and the
 *                  receipt sidebar.
 *   - "failed"     Single failure card (no banner, no summary) pointing the
 *                  user back to the checkout to retry.
 *
 * Markers:
 *   - page root            data-page="thank-you"
 *   - promo banner         data-section="promo-banner" + data-status="..."
 *   - main card            data-section="thank-you-main-card" + data-status
 *   - failure card         data-section="thank-you-failure"
 * -----------------------------------------------------------------------------
 */

import { AlertCircleIcon } from "lucide-react";
import { useSearchParams } from "react-router";

import { PriceRow } from "@/components/checkout/primitives/PriceRow";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import { Button } from "@/components/ui/button";
import { checkoutContent } from "@/content/config";
import { useThankYouPayment } from "@/hooks/useThankYouPayment";
import { Spinner } from "@/components/ui/spinner";

export function ThankYouPage() {
  const { product, summary, thankYou } = checkoutContent;
  const cardTitleClassName =
    "text-[1.875rem] leading-[1.15] font-semibold tracking-[-0.025em] text-foreground";

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  // ConvesioPay may append `?paymentId=` to the return URL after a 3DS
  // challenge. If it does, we use it to mint a thank-you JWT via
  // `/issue-token`; if not, the hook falls back to the sessionStorage entry
  // that `useCheckoutPayment` wrote before the handoff.
  const paymentIdHint = searchParams.get("paymentId");
  const { state, payload, error } = useThankYouPayment({
    token,
    paymentIdHint,
  });

  const isFailed = state === "failed";
  const isProcessing = state === "pending" || state === "verifying";
  const orderNumber = payload?.order_number
    ? `#${payload.order_number}`
    : "#CV-302948";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const paymentStatus = isProcessing
    ? "Pending - Final review in progress"
    : "Paid - Preparing Shipment";
  const mainCardTitle = isProcessing
    ? "Processing Your Payment"
    : "Thank You for Your Order";
  const mainCardSubtitle = isProcessing
    ? "Hang tight — your payment is going through a final review. This page will update automatically as soon as it clears."
    : "Your payment was processed successfully.";
  const includedLabel = `${product.name}${summary.includedProductSuffix ? ` ${summary.includedProductSuffix}` : ""}`;
  const ctaClassName =
    "h-12 w-full rounded-lg border-0 bg-linear-to-b from-pay-cta-from to-pay-cta-to text-base font-extrabold tracking-[0.02em] text-pay-cta-foreground uppercase shadow-pay-cta transition-[transform,box-shadow,background-image] duration-200 hover:from-pay-cta-hover-from hover:to-pay-cta-hover-to hover:shadow-pay-cta-hover motion-safe:animate-pay-cta-pulse cursor-pointer";

  return (
    <main data-page="thank-you" className="bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 sm:px-6">
        {isFailed ? (
          <SectionCard
            section="thank-you-failure"
            title="We couldn't confirm your payment"
          >
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircleIcon className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                {error?.message ??
                  "Your payment could not be confirmed. You haven't been charged — please try checking out again."}
              </p>
              <Button asChild type="button">
                <a href="/">Return to checkout</a>
              </Button>
            </div>
          </SectionCard>
        ) : (
          <>
            {isProcessing ? (
              <section
                data-section="promo-banner"
                data-status={state}
                aria-label="Payment processing message"
                aria-live="polite"
                className="flex items-start gap-3 rounded-xl border border-[#e4d4a5] bg-[#fdf8ea] px-5 py-4"
              >
                <Spinner
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-[#8a6d1a]"
                />
                <div data-slot="promo-copy" className="space-y-1">
                  <p className="text-base font-semibold text-[#4a3a0f]">
                    Processing Payment
                  </p>
                  <p className="text-sm text-[#6a5a2a]">
                    We've received your payment and it's going through a final
                    review. No need to pay again — we'll confirm here as soon
                    as it clears.
                  </p>
                </div>
              </section>
            ) : (
              <section
                data-section="promo-banner"
                data-status="succeeded"
                aria-label="Order confirmation message"
                className="rounded-xl border border-[#cfe1d2] bg-[#f7fcf7] px-5 py-4"
              >
                <div data-slot="promo-copy" className="space-y-1">
                  <p className="text-base font-semibold text-[#173b28]">
                    Order Confirmed
                  </p>
                  <p className="text-sm text-[#4a6351]">
                    Your checkout is complete and your confirmation email is on
                    the way.
                  </p>
                </div>
              </section>
            )}

            <div
              data-section="thank-you-layout"
              className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start"
            >
              <section data-region="thank-you-main" className="flex flex-col gap-4">
                <SectionCard
                  section="thank-you-main-card"
                  data-status={state}
                  title={mainCardTitle}
                  titleClassName={cardTitleClassName}
                >
                  <p className="text-sm text-muted-foreground">
                    {mainCardSubtitle}
                  </p>

                  <section className="mt-2 border-t border-border pt-4">
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      Order Details
                    </h2>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <p
                          data-slot="order-label"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Order Number
                        </p>
                        <p data-slot="order-number" className="mt-1 text-sm text-foreground">
                          {orderNumber}
                        </p>
                      </div>
                      <div>
                        <p
                          data-slot="date-label"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Date
                        </p>
                        <p data-slot="order-date" className="mt-1 text-sm text-foreground">
                          {formattedDate}
                        </p>
                      </div>
                      <div>
                        <p
                          data-slot="status-label"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Status
                        </p>
                        <p data-slot="order-status" className="mt-1 text-sm text-foreground">
                          {paymentStatus}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="mt-2 border-t border-border pt-4">
                    <h2 className="text-base font-semibold tracking-tight text-foreground">
                      {thankYou.nextSteps.title}
                    </h2>
                    <div className="mt-3 space-y-3">
                      <div>
                        <p
                          data-slot="shipment-label"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Shipment
                        </p>
                        <p data-slot="shipment-value" className="mt-1 text-sm text-foreground">
                          You will receive a tracking email within 24 hours.
                        </p>
                      </div>
                      <div>
                        <p
                          data-slot="support-label"
                          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          Support
                        </p>
                        <p data-slot="support-value" className="mt-1 text-sm text-foreground">
                          Need help? Reply to your confirmation email for priority support.
                        </p>
                      </div>
                    </div>
                  </section>
                </SectionCard>
              </section>

              <aside data-region="thank-you-summary" className="lg:sticky lg:top-6 lg:h-max">
                <SectionCard section="receipt-summary" title={thankYou.receipt.title}>
                  <div
                    data-slot="included-products-list"
                    className="rounded-[10px] border border-border bg-[#fafcf8] p-2.5"
                  >
                    <div
                      data-slot="included-product-item"
                      className="my-[7px] flex items-center gap-2.5 text-sm"
                    >
                      <img
                        data-slot="included-product-thumb"
                        src={product.image.src}
                        alt={product.image.alt}
                        className="h-12 w-12 shrink-0 rounded-lg border border-[#d6e2d0] object-cover"
                      />
                      <span className="flex-1 text-foreground">{includedLabel}</span>
                      <strong data-slot="included-product-price" className="text-foreground">
                        {product.salePrice}
                      </strong>
                    </div>
                  </div>

                  <div
                    data-slot="included-products-title"
                    className="mt-1 text-sm font-bold text-[#1a3c2b]"
                  >
                    {summary.includedProductsTitle}
                  </div>

                  <div className="flex flex-col gap-2">
                    <PriceRow
                      data-slot="product-line"
                      line={{
                        id: "product",
                        label: product.name,
                        value: product.salePrice,
                      }}
                      className="my-2 text-[15px]"
                      valueClassName="font-bold"
                    />
                    <PriceRow
                      data-slot="shipping-line"
                      line={summary.shipping}
                      className="my-2 text-[15px]"
                    />
                    <PriceRow
                      data-slot="tax-line"
                      line={summary.tax}
                      className="my-2 text-[15px]"
                    />
                    <PriceRow
                      data-slot="total-line"
                      line={summary.total}
                      className="mt-3 border-t border-border pt-3 text-[22px]"
                      labelClassName="font-bold text-[#122f22]"
                      valueClassName="text-[22px] font-bold text-[#122f22]"
                    />

                    <Button
                      asChild
                      type="button"
                      size="lg"
                      data-slot="cta-primary"
                      className={ctaClassName}
                    >
                      <a href={thankYou.receipt.backToProductHref}>
                        {thankYou.receipt.backToProductLabel}
                      </a>
                    </Button>

                    <div
                      data-slot="guarantee-note"
                      className="rounded-[10px] border border-[#b9e0be] bg-[#eff9f0] p-3 text-[13px] font-bold text-[#1f7a4d]"
                    >
                      {thankYou.receipt.guaranteeNote}
                    </div>
                  </div>
                </SectionCard>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
