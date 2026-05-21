import type { ScheduledController, ExecutionContext } from "@cloudflare/workers-types";

type ScheduledCallback = (
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
) => void | Promise<void>;

export default class CronHandler
{
    private scheduledJobs: Map<string, ScheduledCallback[]> = new Map();

    public on(period: string, callback: ScheduledCallback): void
    {
        const list = this.scheduledJobs.get(period) ?? [];
        list.push(callback);

        this.scheduledJobs.set(period, list);
    }

    public scheduled = async (controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> =>
    {
        const callbacks = this.scheduledJobs.get(controller.cron);
        if (!callbacks?.length) return;

        await Promise.allSettled(
            callbacks.map((callback) => Promise.resolve(callback(controller, env, ctx))),
        );
    };
}
