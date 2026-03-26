import { useLocation, Routes, Route } from "react-router-dom";
import { FooterSection } from "./components/Footer";
import Header from "./HomePage/Header";

import HomePage from "./tabs/HomePage";
import ProductListPage from "./tabs/ProductListPage";
import ProductDetailsPage from "./tabs/ProductDetailsPage";
import CartPage from "./tabs/CartPage";
import MyOrderPage from "./tabs/MyOrderPage";
import AboutUs from "./tabs/AboutUs";
import TermsAndPolicy from "./tabs/TermsAndPolicy";
import RefundPolicy from "./tabs/RefundPolicy";
import ContactUs from "./tabs/ContactUs";

import { useAppContext } from "./context/AppContext";
import AuthCards from "./components/AuthCards";
import Wishlist from "./tabs/Wishlist";
import CheckoutPage from "./tabs/CheckoutPage";
import { useEffect } from "react";

function App() {
  const { authCardPopUp, setAuthCardPopUp } = useAppContext();

  const location = useLocation();

  useEffect(() => {
    // Close auth modal on every route change
    setAuthCardPopUp(false);
  }, [location.pathname]);

  return (

      <div className="min-h-screen flex flex-col">
        <Header />

        {authCardPopUp && (
          <AuthCards
            isOpen={authCardPopUp}
            onClose={() => setAuthCardPopUp(false)}
          />
        )}

        {/* Content grows and pushes the footer down */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/product" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-orders" element={<MyOrderPage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/terms-policy/:type" element={<TermsAndPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>

        {/* Footer stays at the bottom */}
        <FooterSection />
      </div>
  
  );
}

export default App;
