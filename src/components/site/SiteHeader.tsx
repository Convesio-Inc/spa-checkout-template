/**
 * SiteHeader
 * -----------------------------------------------------------------------------
 * Global top navigation bar rendered on every page. Edit the brand name and nav
 * links directly in this file.
 * -----------------------------------------------------------------------------
 */

export function SiteHeader() {
    return (
        <header className="border-b py-4 bg-header-background border-header-border mb-6">
            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">

                <div>
                    <span className="text-base font-bold text-[#1f4933]">BioVerve</span>
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
