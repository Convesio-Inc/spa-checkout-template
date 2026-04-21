/**
 * CheckoutTimer
 * -----------------------------------------------------------------------------
 * Full-width countdown banner rendered below CheckoutHeader. Creates urgency
 * by showing a live timer that counts down from the value defined in
 * `checkoutContent.timer`. Stops at zero.
 *
 * Visual language: brand background (`bg-brand`) with white text, matching the
 * primary color used throughout the page for accents.
 *
 * Layout:
 *   [clock icon]  Your offer expires in   |   00 DAYS  :  00 MINS  :  00 SECS
 *
 * Content source: `checkoutContent.timer`
 *
 * Markers:
 *   - root     data-section="checkout-timer"
 *   - days     data-slot="days"
 *   - minutes  data-slot="minutes"
 *   - seconds  data-slot="seconds"
 * -----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";

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

  const days = Math.floor(remaining / 86400);
  const minutes = Math.floor((remaining % 86400) / 60);
  const seconds = remaining % 60;

  return (
    <div
      data-section="checkout-timer"
      className="flex items-center justify-between gap-4 rounded-xl bg-brand px-5 py-2 text-brand-foreground sm:px-6"
    >
      <div className="flex items-center gap-2 text-sm font-medium opacity-90">
        <ClockIcon className="h-4 w-4 shrink-0" />
        <span>Your offer expires in</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Unit slot="days" value={days} label="Days" />
        <Colon />
        <Unit slot="minutes" value={minutes} label="Mins" />
        <Colon />
        <Unit slot="seconds" value={seconds} label="Secs" />
      </div>
    </div>
  );
}

function Unit({
  slot,
  value,
  label,
}: {
  slot: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span
        data-slot={slot}
        className="font-mono text-xl font-bold tabular-nums sm:text-xl"
      >
        {pad(value)}
      </span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest opacity-80">
        {label}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span className="mb-3 font-mono text-xl font-bold opacity-60 sm:text-2xl">
      :
    </span>
  );
}
