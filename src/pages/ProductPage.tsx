import { GuaranteeBadge } from "@/components/checkout/primitives/GuaranteeBadge";
import { SecureBadge } from "@/components/checkout/primitives/SecureBadge";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import {
  ProductHeader,
  ProductHero,
  ProductCopySection,
} from "@/components/product";
import { checkoutContent } from "@/content/checkout";

export function ProductPage() {
  const { brand, product, productPage, security, guarantee, footer } =
    checkoutContent;

  return (
    <main data-page="product" className="min-h-dvh bg-background py-6 sm:py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 sm:px-6">

        {/* #region SECTION: Product Header */}
        <ProductHeader brand={brand} />
        {/* #endregion */}

        {/* #region SECTION: Product Hero */}
        <ProductHero brand={brand} product={product} copy={productPage} />
        {/* #endregion */}

        {/* #region SECTION: Secure notice */}
        <SecureBadge
          data-section="secure-notice"
          label={security.label}
          className="self-center"
        />
        {/* #endregion */}

        {/* #region SECTION: Product Copy */}
        {product.productCopy && (
          <ProductCopySection html={product.productCopy} />
        )}
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
