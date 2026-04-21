/**
 * CheckoutFooter
 * -----------------------------------------------------------------------------
 * Floating footer rendered at the bottom of the checkout page. No card, no
 * border, no filled background — just a single centered line of muted text
 * that sits naturally under the content.
 *
 * Shows "© {year} {brand}[. suffix]". The year is computed from the client
 * clock so the page ages automatically. The brand name is tinted with the
 * brand color to echo the header.
 *
 * Content source: `checkoutContent.brand.name` + `checkoutContent.footer`
 *
 * Markers:
 *   - root          data-section="checkout-footer"
 *   - copyright     data-slot="copyright"
 *   - brand name    data-slot="footer-brand"
 * -----------------------------------------------------------------------------
 */

import type { FooterCopy } from "@/content/checkout";

export interface CheckoutFooterProps {
  brandName: string;
  copy: FooterCopy;
}

export function CheckoutFooter({ brandName, copy }: CheckoutFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer data-section="checkout-footer">
      <p
        data-slot="copyright"
        className="text-center text-xs text-muted-foreground"
      >
        {"\u00A9 "}
        {year}{" "}
        <span data-slot="footer-brand" className="font-semibold text-brand">
          {brandName}
        </span>
        {copy.suffix ? `. ${copy.suffix}` : ""}
      </p>
    </footer>
  );
}
