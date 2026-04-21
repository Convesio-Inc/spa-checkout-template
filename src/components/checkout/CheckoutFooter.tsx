/**
 * CheckoutFooter
 * -----------------------------------------------------------------------------
 * Floating footer rendered at the bottom of the checkout page. No card, no
 * border, no filled background — just a single centered line of muted text
 * that sits naturally under the content.
 *
 * Shows "[lock] Secure Payment · © {year} {brand}[. suffix]" on one line. The
 * year is computed from the client clock so the page ages automatically. The
 * brand name is tinted with the brand color to echo the header. On very
 * narrow viewports the row wraps so nothing overflows.
 *
 * Content source: `checkoutContent.brand.name` + `checkoutContent.footer` +
 *                 `checkoutContent.security`
 *
 * Markers:
 *   - root          data-section="checkout-footer"
 *   - separator     data-slot="footer-separator"
 *   - copyright     data-slot="copyright"
 *   - brand name    data-slot="footer-brand"
 * -----------------------------------------------------------------------------
 */

import { SecureBadge } from "@/components/checkout/primitives/SecureBadge";
import type { FooterCopy, SecurityCopy } from "@/content/checkout";

export interface CheckoutFooterProps {
  brandName: string;
  copy: FooterCopy;
  security: SecurityCopy;
}

export function CheckoutFooter({
  brandName,
  copy,
  security,
}: CheckoutFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      data-section="checkout-footer"
      className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted-foreground"
    >
      <SecureBadge label={security.label} />
      <span data-slot="footer-separator" aria-hidden="true">
        {"\u00B7"}
      </span>
      <p data-slot="copyright" className="text-center">
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
