/**
 * ThankYouPage
 * -----------------------------------------------------------------------------
 * Landing page after the checkout redirects. Reads the `?token=` JWT that the
 * worker signed on success/pending, verifies it server-side, and drives a
 * state machine via `useThankYouPayment`:
 *
 *   - "verifying"  ThankYouHeader shows a subtle spinner + "confirming"
 *                  copy while the worker verifies the token.
 *   - "pending"    Same header treatment with "finalising" copy. The hook
 *                  polls `/poll-payment` every 5s until the upstream status
 *                  flips to succeeded or failed — layout doesn't jump when
 *                  it does, the header just swaps icon and copy.
 *   - "succeeded"  Full thank-you layout — confirmed header, order summary,
 *                  next steps, guarantee.
 *   - "failed"     Single failure card (no header, no next-steps) pointing
 *                  the user back to the checkout to retry.
 *
 * Markers:
 *   - page root            data-page="thank-you"
 *   - failure card         data-section="thank-you-failure"
 * -----------------------------------------------------------------------------
 */

import { AlertCircleIcon } from "lucide-react";
import { useSearchParams } from "react-router";

import { GuaranteeBadge } from "@/components/checkout/primitives/GuaranteeBadge";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import {
  NextStepsCard,
  OrderConfirmationCard,
  ThankYouHeader,
} from "@/components/thank-you";
import { Button } from "@/components/ui/button";
import { checkoutContent } from "@/content/checkout";
import { useThankYouPayment } from "@/hooks/useThankYouPayment";

export function ThankYouPage() {
  const { brand, product, summary, guarantee, thankYou } =
    checkoutContent;

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { state, error } = useThankYouPayment(token);

  const isFailed = state === "failed";

  return (
    <main data-page="thank-you" className="min-h-dvh bg-background py-6 sm:py-10">
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
            {/* #region SECTION: Thank-You Header */}
            <ThankYouHeader
              brand={brand}
              heading={thankYou.heading}
              subheading={thankYou.subheading}
              status={state}
            />
            {/* #endregion */}

            {/* #region SECTION: Order Confirmation */}
            <OrderConfirmationCard
              title={thankYou.confirmation.title}
              product={product}
              summary={summary}
            />
            {/* #endregion */}

            {/* #region SECTION: Next Steps */}
            <NextStepsCard
              title={thankYou.nextSteps.title}
              steps={thankYou.nextSteps.steps}
            />
            {/* #endregion */}

            {/* #region SECTION: Guarantee */}
            <GuaranteeBadge
              data-section="guarantee"
              days={guarantee.days}
              daysLabel={guarantee.daysLabel}
              title={guarantee.title}
              description={guarantee.description}
            />
            {/* #endregion */}
          </>
        )}
      </div>
    </main>
  );
}
