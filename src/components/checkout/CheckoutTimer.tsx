/**
 * CheckoutTimer
 * -----------------------------------------------------------------------------
 * Template-inspired countdown banner rendered inside the checkout form stack.
 * Displays lead text, a live MM:SS timer badge, and helper text. Stops at zero.
 *
 * Content source: `checkoutContent.timer`
 *
 * Markers:
 *   - root              data-section="checkout-timer"
 *   - countdown timer   data-slot="countdown-timer"
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";

import type { TimerConfig } from "@/content/checkout";

export interface CheckoutTimerProps {
  timer: TimerConfig;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function CheckoutTimer({ timer }: CheckoutTimerProps) {
  const initialSeconds =
    timer.days * 86400 + timer.minutes * 60 + timer.seconds;

  const [remaining, setRemaining] = useState(initialSeconds);

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
        {timer.leadText}
      </strong>
      <span
        data-slot="countdown-timer"
        className="inline-block min-w-[52px] rounded-md border border-[#d2dfd4] bg-[#edf3ee] px-[7px] py-[3px] text-center font-mono text-sm font-bold tracking-[0.01em] text-[#264635] tabular-nums sm:text-sm"
      >
        {mmss}
      </span>
      <span>{timer.helperText}</span>
    </div>
  );
}
