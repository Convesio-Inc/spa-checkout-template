declare module "virtual:convesio-extensions"
{
    import type { Hono } from "hono";

    import type CronHandler from "./CronHandler.js";

    interface CheckoutExtension
    {
        name: string;

        register: (api: Hono<{ Bindings: Env }>, cron: CronHandler) => void;
    }

    const extensions: CheckoutExtension[];

    export default extensions;
}
