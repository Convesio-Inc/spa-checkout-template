/**
 * useThankYouPayment
 * -----------------------------------------------------------------------------
 * Drives the thank-you page's "is the payment done yet?" lifecycle.
 *
 * Flow:
 *
 *   1. On mount, POST the URL `?token=` to `/verify-token` to decode the JWT
 *      the worker signed at redirect time.
 *   2. If the decoded status is already terminal (Succeeded / Authorized →
 *      "succeeded", or anything else non-pending → "failed"), we're done.
 *   3. If the status is "Pending", poll `/poll-payment` every 5s with
 *      `{ payment_id }` and map each response's status through
 *      the same sets. Clears the interval on terminal status or unmount.
 *
 * Exposed state:
 *
 *   {
 *     state,    // "verifying" | "pending" | "succeeded" | "failed"
 *     payload,  // decoded JWT body (once verified)
 *     error,    // Error | null — set on verify failure / missing token /
 *               // non-ok poll responses with a failed status
 *   }
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react";

export type ThankYouState =
  | "verifying"
  | "pending"
  | "succeeded"
  | "failed";

export interface CheckoutTokenPayload {
  payment_id: string;
  customer_id: string;
  order_number: string;
  status: string;
}

export interface UseThankYouPaymentResult {
  state: ThankYouState;
  payload: CheckoutTokenPayload | null;
  error: Error | null;
}

const SUCCESS_STATUSES = new Set(["Succeeded", "Authorized"]);
const PENDING_STATUSES = new Set(["Pending"]);

const POLL_INTERVAL_MS = 5000;

function classify(status: string | undefined): ThankYouState {
  if (status && SUCCESS_STATUSES.has(status)) return "succeeded";
  if (status && PENDING_STATUSES.has(status)) return "pending";
  return "failed";
}

export function useThankYouPayment(
  token: string | null,
): UseThankYouPaymentResult {
  // When the URL has no token there's nothing to verify — skip the "verifying"
  // flash entirely and land on "failed" on the very first render.
  const [state, setState] = useState<ThankYouState>(() =>
    token ? "verifying" : "failed",
  );
  const [payload, setPayload] = useState<CheckoutTokenPayload | null>(null);
  const [error, setError] = useState<Error | null>(() =>
    token ? null : new Error("Missing confirmation token."),
  );

  // Keep the latest payload available to the poller without re-arming the
  // effect on every status change (which would leak intervals).
  const payloadRef = useRef<CheckoutTokenPayload | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const stopPolling = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const poll = async () => {
      const current = payloadRef.current;
      if (!current) return;

      let response: Response;
      try {
        response = await fetch("/poll-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            payment_id: current.payment_id,
          }),
        });
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setState("failed");
        stopPolling();
        return;
      }

      let body:
        | { status?: string; error?: boolean; message?: string }
        | null = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      if (cancelled) return;

      if (!response.ok || body?.error) {
        setError(
          new Error(
            body?.message ??
              `Payment status check failed (${response.status} ${response.statusText})`,
          ),
        );
        setState("failed");
        stopPolling();
        return;
      }

      const next = classify(body?.status);
      if (next === "pending") return; // keep polling
      setState(next);
      if (next === "failed") {
        setError(
          new Error(
            `Payment ${(body?.status ?? "failed").toLowerCase()}.`,
          ),
        );
      }
      stopPolling();
    };

    (async () => {
      let response: Response;
      try {
        response = await fetch("/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ token }),
        });
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setState("failed");
        return;
      }

      let body:
        | (CheckoutTokenPayload & { error?: boolean; message?: string })
        | null = null;
      try {
        body = await response.json();
      } catch {
        body = null;
      }

      if (cancelled) return;

      if (!response.ok || body?.error || !body) {
        setError(
          new Error(
            body?.message ??
              `Could not verify confirmation token (${response.status} ${response.statusText})`,
          ),
        );
        setState("failed");
        return;
      }

      const decoded: CheckoutTokenPayload = {
        payment_id: body.payment_id,
        customer_id: body.customer_id,
        order_number: body.order_number,
        status: body.status,
      };
      payloadRef.current = decoded;
      setPayload(decoded);

      const next = classify(decoded.status);
      setState(next);

      if (next === "pending") {
        // Immediate refresh before the first 5s tick so slow-webhook cases
        // resolve as quickly as possible when the user lands.
        void poll();
        intervalId = setInterval(() => {
          void poll();
        }, POLL_INTERVAL_MS);
      }
    })();

    return () => {
      cancelled = true;
      stopPolling();
    };
  }, [token]);

  return { state, payload, error };
}
