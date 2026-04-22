import { CheckoutPage } from "@/pages/CheckoutPage";
import { ProductPage } from "@/pages/ProductPage";
import { ThankYouPage } from "@/pages/ThankYouPage";
import { BrowserRouter, Route, Routes } from "react-router";
import { SiteHeader } from "@/components/site";
import { SiteFooter } from "@/components/site";

function App() {
  return (
    <>
      <SiteHeader />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CheckoutPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </BrowserRouter>
      <SiteFooter />
    </>
  );
}

export default App;
