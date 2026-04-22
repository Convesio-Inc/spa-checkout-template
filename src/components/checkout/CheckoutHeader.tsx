/**
 * CheckoutHeader
 * -----------------------------------------------------------------------------
 * Top information strip shown above the checkout form. All user-visible copy is
 * sourced from `checkoutContent.header.topBar`.
 * -----------------------------------------------------------------------------
 */

import { checkoutContent } from "@/content/checkout";

export function CheckoutHeader() {
  const { badge, messages } = checkoutContent.header.topBar;

  return (
    <div
      data-section="checkout-header"
      data-slot="top-bar"
      className="mb-4 flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-[#cde0cf] bg-[#eef7ef] px-3 py-2.5 text-xs text-[#245238] sm:text-sm"
    >
      <span className="inline-flex items-center rounded-full border border-[#c8ddca] bg-white px-2.5 py-1.5 font-semibold text-[#1f4b34]">
        {badge}
      </span>
      {messages.map((message) => (
        <span
          key={message}
          className="inline-flex items-center rounded-full border border-[#d5e6d7] bg-[#f7fcf7] px-2.5 py-1.5"
        >
          {message}
        </span>
      ))}
    </div>
  );
}
