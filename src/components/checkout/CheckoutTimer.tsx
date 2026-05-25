/**
 * CheckoutTimer
 * -----------------------------------------------------------------------------
 * Countdown banner rendered inside the checkout form stack. Displays lead text,
 * a live MM:SS timer badge, and helper text. Stops at zero.
 *
 * To change the starting time, edit INITIAL_SECONDS below.
 *
 * Markers:
 *   - root              data-section="checkout-timer"
 *   - countdown timer   data-slot="countdown-timer"
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";

const INITIAL_SECONDS = 14 * 60 + 59; // 14:59

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function CheckoutTimer() {
  const [remaining, setRemaining] = useState(INITIAL_SECONDS);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const mmss = `${pad(minutes)}:${pad(seconds)}`;

  return (
    <div
      data-section="checkout-timer"
      aria-live="polite"
      className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[#d9e4da] bg-[#f7fbf7] px-3 py-2.5 text-xs text-[#3f5c49] sm:text-sm"
    >
      <strong className="text-xs font-semibold tracking-[0.01em] sm:text-sm">
        Offer reserved for:
      </strong>
      <span
        data-slot="countdown-timer"
        className="inline-block min-w-[52px] rounded-md border border-[#d2dfd4] bg-[#edf3ee] px-[7px] py-[3px] text-center font-mono text-sm font-bold tracking-[0.01em] text-[#264635] tabular-nums sm:text-sm"
      >
        {mmss}
      </span>
      <span>Complete checkout now to keep your bonus.</span>
    </div>
  );
}
