import type { Hono } from "hono";

import extensions from "virtual:convesio-extensions";

import type CronHandler from "./CronHandler";

export default class Extensions
{
    public static load(api: Hono<{ Bindings: Env }>, cron: CronHandler): void
    {
        for (const extension of extensions)
        {
            extension.register(api, cron);
        }
    }
}