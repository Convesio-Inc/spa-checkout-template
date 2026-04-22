import { GuaranteeBadge } from "@/components/checkout/primitives/GuaranteeBadge";
import {
  ProductHeader,
  ProductHero,
  ProductCopySection,
} from "@/components/product";
import { checkoutContent } from "@/content/checkout";

export function ProductPage() {
  const { brand, product, productPage, guarantee } =
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

      </div>
    </main>
  );
}
