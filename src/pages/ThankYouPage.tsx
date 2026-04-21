import { GuaranteeBadge } from "@/components/checkout/primitives/GuaranteeBadge";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import {
  ThankYouHeader,
  OrderConfirmationCard,
  NextStepsCard,
} from "@/components/thank-you";
import { checkoutContent } from "@/content/checkout";

export function ThankYouPage() {
  const { brand, product, summary, security, guarantee, footer, thankYou } =
    checkoutContent;

  return (
    <main data-page="thank-you" className="min-h-dvh bg-background py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 sm:px-6">

        {/* #region SECTION: Thank-You Header */}
        <ThankYouHeader
          brand={brand}
          heading={thankYou.heading}
          subheading={thankYou.subheading}
        />
        {/* #endregion */}

        {/* #region SECTION: Order Confirmation */}
        <OrderConfirmationCard
          title={thankYou.confirmation.title}
          product={product}
          summary={summary}
          security={security}
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

        <CheckoutFooter
          brandName={brand.name}
          copy={footer}
          security={security}
        />

      </div>
    </main>
  );
}
