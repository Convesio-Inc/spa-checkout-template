/**
 * ProductCopySection
 * -----------------------------------------------------------------------------
 * Renders trusted HTML product copy (from `product.productCopy`) as a styled
 * content block. The HTML is authored internally and never sourced from user
 * input, so dangerouslySetInnerHTML is safe here.
 *
 * Markers:
 *   - root   data-section="product-copy"
 * -----------------------------------------------------------------------------
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ProductCopySectionProps {
  html: string;
  className?: string;
}

export function ProductCopySection({ html, className }: ProductCopySectionProps) {
  return (
    <Card data-section="product-copy">
      <CardContent
        className={cn(
          "[&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground",
          "[&_h3]:mb-1 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground",
          "[&_p]:mb-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground",
          "[&_ul]:mb-3 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-4",
          "[&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-muted-foreground [&_li]:list-disc",
          "[&_strong]:font-semibold [&_strong]:text-foreground",
          className
        )}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Card>
  );
}
