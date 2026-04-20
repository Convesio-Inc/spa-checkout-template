export {};

declare global {
  function ConvesioPay(apiKey: string): unknown;

  interface Window {
    ConvesioPay: typeof ConvesioPay;
  }
}
