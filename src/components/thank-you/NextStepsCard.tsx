/**
 * NextStepsCard
 * -----------------------------------------------------------------------------
 * Ordered list of post-purchase steps shown on the thank-you page.
 * Each step has an icon resolved from the step id, a title, and a description.
 *
 * Markers:
 *   - root             data-section="next-steps" (via SectionCard)
 *   - step item        data-slot="step-item", data-row-id={step.id}
 *   - step icon wrap   data-slot="step-icon"
 *   - step title       data-slot="step-title"
 *   - step description data-slot="step-description"
 * -----------------------------------------------------------------------------
 */

import { MailIcon, PackageIcon, TruckIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SectionCard } from "@/components/checkout/primitives/SectionCard";
import type { ThankYouStep } from "@/content/checkout";

const STEP_ICONS: Record<string, LucideIcon> = {
  email: MailIcon,
  processing: PackageIcon,
  delivery: TruckIcon,
};

export interface NextStepsCardProps {
  title: string;
  steps: ThankYouStep[];
}

export function NextStepsCard({ title, steps }: NextStepsCardProps) {
  return (
    <SectionCard section="next-steps" title={title}>
      <ol className="flex list-none flex-col gap-4 p-0">
        {steps.map((step) => {
          const Icon = STEP_ICONS[step.id];
          return (
            <li
              key={step.id}
              data-slot="step-item"
              data-row-id={step.id}
              className="flex items-start gap-3"
            >
              <div
                data-slot="step-icon"
                aria-hidden="true"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand"
              >
                {Icon && <Icon className="h-4 w-4" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <p
                  data-slot="step-title"
                  className="text-sm font-semibold text-foreground"
                >
                  {step.title}
                </p>
                <p
                  data-slot="step-description"
                  className="text-xs leading-relaxed text-muted-foreground"
                >
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </SectionCard>
  );
}
