/**
 * useConvesioPayCheckout
 * -----------------------------------------------------------------------------
 * React hook that wires up a ConvesioPay checkout component lifecycle:
 *
 *   1. Fetches the public-safe credentials from `/config` (deduplicated across
 *      the whole app — see `fetchConvesioPayConfig`).
 *   2. Lazily initializes the ConvesioPay SDK instance (once per page load).
 *   3. Creates + mounts a component inside the provided container `ref`.
 *
 * It returns `{ status, component, error }`:
 *
 *   - `status` is `"loading" | "ready" | "error"`, handy for rendering fallbacks.
 *   - `component` is the mounted ConvesioPay component (use it to call
 *     `updateEmail` as the cart changes, or to attach events).
 *   - `error` surfaces any config-fetch / init / mount failure.
 *
 * The mount runs only when the container ref resolves and is guarded against
 * React 18 StrictMode's effect double-invocation via a ref latch.
 * -----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState, type RefObject } from "react";

import {
  fetchConvesioPayConfig,
  getConvesioPayInstance,
  type ConvesioPayConfig,
} from "@/lib/convesiopay";

export type ConvesioPayCheckoutStatus = "loading" | "ready" | "error";

/**
 * The ConvesioPay SDK's `component.mount(...)` runs `document.querySelector`
 * on whatever it receives, so it really needs a CSS selector string (the
 * docs' `domElement` parameter name is a red herring). If the caller's
 * container element doesn't already have an `id`, we stamp a unique one on
 * it so we can feed `"#that-id"` to the SDK.
 */
let autoIdCounter = 0;
function ensureSelector(el: HTMLElement): string {
  if (!el.id) {
    autoIdCounter += 1;
    el.id = `cpay-mount-${autoIdCounter}`;
  }
  return `#${el.id}`;
}

/** Component options the caller may customize. `environment` + `clientKey` are
 *  injected from `/config`, so they are omitted here. */
export type ConvesioPayCheckoutOptions = Omit<
  ConvesioPayComponentOptions,
  "environment" | "clientKey"
>;

export interface UseConvesioPayCheckoutResult {
  status: ConvesioPayCheckoutStatus;
  component: ConvesioPayComponent | null;
  error: Error | null;
  config: ConvesioPayConfig | null;
}

export function useConvesioPayCheckout(
  containerRef: RefObject<HTMLElement | null>,
  options: ConvesioPayCheckoutOptions = {},
): UseConvesioPayCheckoutResult {
  const [config, setConfig] = useState<ConvesioPayConfig | null>(null);
  const [component, setComponent] = useState<ConvesioPayComponent | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetchConvesioPayConfig()
      .then((next) => {
        if (!cancelled) setConfig(next);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!config || !containerRef.current || mountedRef.current) return;

    try {
      const cpay = getConvesioPayInstance(config.apiKey);
      const instance = cpay.component({
        environment: config.environment,
        clientKey: config.clientKey,
        ...options,
      });
      instance.mount(ensureSelector(containerRef.current));
      mountedRef.current = true;
      // One-shot status flip after the SDK mounts its iframe — this runs at
      // most once per page load (guarded by mountedRef), so there is no
      // cascade-render risk the lint rule is warning about.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComponent(instance);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
    // We intentionally do NOT depend on `options`: the component is mounted
    // once and callers should drive updates via component.updateEmail /
    // Re-running this effect would create a duplicate
    // component in the same container.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, containerRef]);

  const status: ConvesioPayCheckoutStatus = error
    ? "error"
    : component
      ? "ready"
      : "loading";

  return { status, component, error, config };
}
