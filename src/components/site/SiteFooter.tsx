import { checkoutContent } from "@/content/config";

export function SiteFooter() {
  const { brand, footer } = checkoutContent;

  return (
    <footer className="mt-[26px] border-t border-[#d5e3d7] bg-[#f4faf4] text-xs text-[#4f6658]">
      <div className="mx-auto flex w-full max-w-[1140px] flex-wrap items-center justify-between gap-[10px] px-[18px] py-[18px] max-sm:px-3 max-sm:py-[10px]">
        <span>{brand.name} {footer.primaryLine}</span>
        <span>{footer.secondaryLine}</span>
      </div>
    </footer>
  );
}