import { CheckoutPage } from "@/pages/CheckoutPage";
import { ProductPage } from "@/pages/ProductPage";
import { ThankYouPage } from "@/pages/ThankYouPage";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
