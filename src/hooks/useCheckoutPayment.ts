/**
 * useCheckoutPayment
 * -----------------------------------------------------------------------------
 * Tiny state machine that drives the Pay Now -> processing -> success/failed
 * flow. Exposes:
 *
 *   {
 *     status,   // "idle" | "processing" | "success" | "pending" | "failed"
 *     error,    // Error, only set while status === "failed"
 *     result,   // PaymentResponse, set while status === "success" | "pending"
 *     pay,      // (component, payload) => Promise<void>
 *     reset,    // () => void — returns to "idle"
 *   }
 *
 * `pay()` runs the full pipeline:
 *
 *   1. `component.createToken()` to get a `paymentToken` from the SDK.
 *   2. `POST /payments` on our worker with the token + customer/shipping
 *      fields, which forwards server-side to the ConvesioPay API.
 *   3. Maps the response into `success` / `pending` / `failed`.
 *
 * "Pending" is the ConvesioPay status we get when the merchant has checkout
 * configured so the transaction is validated after initial checks but still
 * needs to be accepted/denied through an async webhook. The worker has no way
 * to block on that webhook, so we surface it to the user as a dedicated state
 * instead of claiming the payment succeeded.
 *
 * All errors (SDK tokenization, network, non-2xx, upstream `error: true`) land
 * on `status === "failed"` with a human-readable `error.message`.
 * -----------------------------------------------------------------------------
 */

import { useCallback, useState } from "react";

export type CheckoutPaymentStatus =
  | "idle"
  | "processing"
  | "success"
  | "pending"
  | "failed";

export interface Address {
  houseNumberOrName: string;
  street: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  amountIncludingTax: number;
}
export interface PaymentPayload {
  email: string;
  name: string;
  amount: number;
  currency: string;
  phone?: { number: string; countryCode: string };
  billingAddress?: Address;
  shippingAddress?: Address;
  lineItems?: LineItem[];
}

export interface PaymentResponse {
  id?: string;
  orderNumber?: string;
  status?: string;
  amount?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface PaymentErrorResponse {
  error?: boolean;
  message?: string;
}

export interface UseCheckoutPaymentResult {
  status: CheckoutPaymentStatus;
  error: Error | null;
  result: PaymentResponse | null;
  pay: (
    component: ConvesioPayComponent,
    payload: PaymentPayload,
  ) => Promise<void>;
  reset: () => void;
}

const SUCCESS_STATUSES = new Set(["Succeeded", "Authorized"]);
const PENDING_STATUSES = new Set(["Pending"]);

export function useCheckoutPayment(): UseCheckoutPaymentResult {
  const [status, setStatus] = useState<CheckoutPaymentStatus>("idle");
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<PaymentResponse | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResult(null);
  }, []);

  const pay = useCallback(
    async (component: ConvesioPayComponent, payload: PaymentPayload) => {
      setStatus("processing");
      setError(null);
      setResult(null);

      let paymentToken: string;
      try {
        paymentToken = await component.createToken();
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus("failed");
        return;
      }

      let response: Response;
      try {
        response = await fetch("/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ paymentToken, ...payload }),
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus("failed");
        return;
      }

      let body: (PaymentResponse & PaymentErrorResponse) | null = null;
      try {
        body = (await response.json()) as PaymentResponse & PaymentErrorResponse;
      } catch {
        body = null;
      }

      if (!response.ok || body?.error) {
        const message =
          body?.message ??
          `Payment request failed (${response.status} ${response.statusText})`;
        setError(new Error(message));
        setStatus("failed");
        return;
      }

      if (
        body &&
        body.status &&
        !SUCCESS_STATUSES.has(body.status) &&
        !PENDING_STATUSES.has(body.status)
      ) {
        setError(
          new Error(`Payment ${body.status.toLowerCase()}. Please try again.`),
        );
        setResult(body);
        setStatus("failed");
        return;
      }

      setResult(body);
      setStatus(
        body?.status && PENDING_STATUSES.has(body.status)
          ? "pending"
          : "success",
      );
    },
    [],
  );

  return { status, error, result, pay, reset };
}
