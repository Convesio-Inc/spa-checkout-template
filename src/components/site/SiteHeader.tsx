import { checkoutContent } from "@/content/checkout";

export function SiteHeader() {

    const { brand } = checkoutContent;

    return (
        <header className="border-b py-4 bg-header-background border-header-border mb-6">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                <div>
                    <span className="text-base font-bold text-[#1f4933]">{brand.name}</span>
                </div>

                <div className="flex items-center gap-2 text-[#335b43] text-sm">
                    <a className="hover:underline" href="/product">Product</a>
                    <a className="hover:underline" href="/">Checkout</a>
                    <a className="hover:underline" href="#">Contact</a> {/* Change this or add more items if needed */}
                </div>
            </div>
        </header>
    );
}