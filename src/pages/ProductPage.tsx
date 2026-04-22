import { checkoutContent } from "@/content/config";
import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import { PriceRow } from "@/components/checkout/primitives/PriceRow";
import { Button } from "@/components/ui/button";

export function ProductPage() {
  const { product, productPage, summary, guarantee } = checkoutContent;
  const cardTitleClassName =
    "text-[1.875rem] leading-[1.15] font-semibold tracking-[-0.025em] text-foreground";
  const includedLabel = `${product.name}${summary.includedProductSuffix ? ` ${summary.includedProductSuffix}` : ""}`;
  const ctaClassName =
    "h-12 w-full rounded-lg border-0 bg-linear-to-b from-pay-cta-from to-pay-cta-to text-base font-extrabold tracking-[0.02em] text-pay-cta-foreground uppercase shadow-pay-cta transition-[transform,box-shadow,background-image] duration-200 hover:from-pay-cta-hover-from hover:to-pay-cta-hover-to hover:shadow-pay-cta-hover motion-safe:animate-pay-cta-pulse cursor-pointer";

  return (
    <main data-page="product" className="min-h-dvh bg-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 sm:px-6">
        <section
          data-section="promo-banner"
          aria-label="Product hero message"
          className="rounded-xl border border-[#d6e2d0] bg-[#f8fcf7] px-4 py-4 sm:px-5"
        >
          <div className="grid gap-4 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:items-center">
            <img
              data-slot="promo-image"
              src={product.heroImage?.src ?? product.image.src}
              alt={product.heroImage?.alt ?? product.image.alt}
              className="w-full rounded-lg border border-[#d6e2d0] object-cover"
            />
            <div data-slot="promo-copy" className="space-y-1">
              <p className="text-base font-semibold text-[#173b28]">{product.name}</p>
              <p className="text-sm text-[#4a6351]">
                Designed for consistent daily support, with premium quality and
                dependable fulfillment.
              </p>
            </div>
          </div>
        </section>

        <div
          data-section="product-layout"
          className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start"
        >
          <section data-region="product-main" className="flex flex-col gap-4">
            <SectionCard
              section="product-details"
              title="Product Details"
              titleClassName={cardTitleClassName}
            >
              <p className="text-sm text-muted-foreground">
                Everything included in your premium checkout bundle.
              </p>

              <section className="mt-2 border-t border-border pt-4">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Why Customers Choose This Offer
                </h2>
                <div className="mt-3 grid gap-3">
                  <div>
                    <p
                      data-slot="offer-label-1"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Clinically focused formula
                    </p>
                    <p data-slot="offer-value-1" className="mt-1 text-sm text-foreground">
                      {product.description ??
                        "High-quality ingredients selected to support daily health and energy."}
                    </p>
                  </div>
                  <div>
                    <p
                      data-slot="offer-label-2"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Bonus value
                    </p>
                    <p data-slot="offer-value-2" className="mt-1 text-sm text-foreground">
                      Secure ordering, priority processing, and dependable support come
                      included with your order.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-2 border-t border-border pt-4">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Shipping &amp; Guarantee
                </h2>
                <div className="mt-3 grid gap-3">
                  <div>
                    <p
                      data-slot="shipping-label"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Delivery
                    </p>
                    <p data-slot="shipping-value" className="mt-1 text-sm text-foreground">
                      Ships in 1 business day with tracked delivery.
                    </p>
                  </div>
                  <div>
                    <p
                      data-slot="guarantee-label"
                      className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      Risk-Free Promise
                    </p>
                    <p data-slot="guarantee-value" className="mt-1 text-sm text-foreground">
                      {guarantee.title}. If you are not satisfied within{" "}
                      {guarantee.days} days, we will make it right.
                    </p>
                  </div>
                </div>
              </section>
            </SectionCard>
          </section>

          <aside data-region="product-summary" className="lg:sticky lg:top-6 lg:h-max">
            <SectionCard section="product-snapshot" title="Bundle Snapshot">
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
                  <a href="/">{productPage.ctaLabel}</a>
                </Button>

                <div
                  data-slot="guarantee-note"
                  className="rounded-[10px] border border-[#b9e0be] bg-[#eff9f0] p-3 text-[13px] font-bold text-[#1f7a4d]"
                >
                  {guarantee.title}. Secure encrypted checkout.
                </div>
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </main>
  );
}
