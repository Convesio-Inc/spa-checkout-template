export {};

declare global {
  type ConvesioPayEnvironment = "test" | "live";
  type ConvesioPayTheme = "light" | "dark";

  interface ConvesioPayComponentOptions {
    environment: ConvesioPayEnvironment;
    clientKey: string;
    customerEmail?: string;
    integration?: string;
    theme?: ConvesioPayTheme;
  }

  interface ConvesioPayComponent {
    mount: (selector: string) => void;
    updateEmail: (email: string) => void;
    on?: (event: string, handler: (payload: unknown) => void) => void;
    off?: (event: string, handler: (payload: unknown) => void) => void;
  }

  interface ConvesioPayInstance {
    component: (options: ConvesioPayComponentOptions) => ConvesioPayComponent;
  }

  function ConvesioPay(apiKey: string): ConvesioPayInstance;

  interface Window {
    ConvesioPay: typeof ConvesioPay;
  }
}
