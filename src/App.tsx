import { CheckoutPage } from "@/pages/CheckoutPage";
import { ProductPage } from "@/pages/ProductPage";
import { ThankYouPage } from "@/pages/ThankYouPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { SiteHeader } from "@/components/site";
import { SiteFooter } from "@/components/site";

function App() {
  return (
    <>
      <main className="min-h-dvh flex flex-col">
        <SiteHeader />
        <div className="flex-1">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<CheckoutPage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/thank-you" element={<ThankYouPage />} />
            </Routes>
          </BrowserRouter>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}

export default App;
