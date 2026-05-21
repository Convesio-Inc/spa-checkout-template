/**
 * NextStepsCard
 * -----------------------------------------------------------------------------
 * Ordered list of post-purchase steps shown on the thank-you page. Each step
 * has an icon resolved from the step id, a title, and a description.
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

const STEP_ICONS: Record<string, LucideIcon> = {
  email: MailIcon,
  processing: PackageIcon,
  delivery: TruckIcon,
};

const STEPS = [
  {
    id: "email",
    title: "Check your inbox",
    description:
      "A confirmation email with your order details has been sent to you.",
  },
  {
    id: "processing",
    title: "Order processing",
    description:
      "Our team is preparing your order and getting it ready to ship.",
  },
  {
    id: "delivery",
    title: "Delivery",
    description:
      "Your package will be on its way soon. Expect delivery within 5–7 business days.",
  },
];

export function NextStepsCard() {
  return (
    <SectionCard section="next-steps" title="What Happens Next">
      <ol className="flex list-none flex-col gap-4 p-0">
        {STEPS.map((step) => {
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
