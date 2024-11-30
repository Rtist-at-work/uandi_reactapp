import { Routes, Route, useNavigate } from "react-router-dom"; // Added useLocation
import axios from "axios";
import React from "react";
import Container from "./components/Container";
import "./index.css";
import Signup from "./login/SIgnup";
import Login from "./login/Login";
import Forgotpassword from "./login/Forgotpassword";
import Resetpassword from "./login/ResetPassword";
import Homepage from "./client/Homepage";
import ProductDetails from "./client/ProductDetails";
import Cart from "./client/Cart";
import OrderPage from "./client/OrderPage";
import AddressForm from "./client/AddressForm";
import PaymentPage from "./client/PaymentPage";
import ProductPage from "./client/ProductPage";
import ProfilePage from "./client/ProfilePage";
import DeliveryAddress from "./client/DeliveryAddress";
import Whishlist from "./client/Whishlist";
import UserOrders from "./client/UserOrders";
import OrderTracking from "./client/OrderTracking";
import PrivacyPolicy from "./client/PrivacyPolicy";
import Return from "./client/Return";

const URI = "http://localhost:5000";

function App() {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const handleAddAddress = (e, index, pageType) => {
    if (e.target.id === "addAddress") {
      navigate(`/addressform/?pageType=${pageType}`);
    } else {
      navigate(`/addressform/?index=${index}&pageType=${pageType}`);
    }
  };

  const handleCart = (
    e,
    productDetails,
    selectedSize,
    selectedColor,
    count
  ) => {
    if (selectedSize && selectedColor && productDetails) {
      const formdata = {
        productDetails: productDetails,
        count: count,
        selectedSize: selectedSize,
        selectedColor: selectedColor,
      };

      const addCart = async () => {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        try {
          const response = await axios.post(
            `${URI}/auth/cart`,
            formdata,
            config
          );
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            if (e.target.id === "buy") navigate("/cart");
            else alert("product added to cart successfully");
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status; // Get the status code
            const errorMessage = error.response?.data.message; // Get the error message
            console.error(`Error: ${errorMessage}, Status Code: ${statusCode}`);
            if (statusCode === 401) {
              alert("Please log in again to Place order");
              navigate("/login", {
                state: { productDetails, selectedSize, navigation: "cart" },
              });
            } else if (statusCode === 400) {
              console.log("Bad request. Please check your input.");
            } else if (statusCode === 404) {
              alert("something went wrong please try later");
            }
          } else {
            console.error("Unexpected error:", error);
          }
        }
      };

      addCart();
    } else if (!selectedSize) {
      alert("please slect Size");
    } else if (!productDetails) {
      alert("an error occured to add products to cart please try again later");
    }
  };

  return (
    <>
      <div className="relative w-screen h-screen">
        <Routes>
          <Route path="/*" element={<Container />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login handleCart={handleCart} />} />

          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route
            path="/auth/resetpassword/:token"
            element={<Resetpassword />}
          />
          <Route path="/" element={<Homepage handleCart={handleCart} />} />
          <Route
            path="/productpage"
            element={
              <ProductPage
              // handleWhishlist={handleWhishlist}
              />
            }
          />
          <Route
            path="/ProductDetails"
            element={
              <ProductDetails
                handleCart={handleCart}
              />
            }
          />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/orderpage"
            element={<OrderPage handleAddAddress={handleAddAddress} />}
          />
          <Route path="/Whishlist" element={<Whishlist />} />
          <Route path="/addressform" element={<AddressForm />} />
          <Route path="/paymentpage" element={<PaymentPage />} />
          <Route path="/profilepage" element={<ProfilePage />} />
          <Route
            path="/deliveryaddress"
            element={<DeliveryAddress handleAddAddress={handleAddAddress} />}
          />
          <Route path="/userorders" element={<UserOrders />} />
          <Route path="/ordertracking/:orderId" element={<OrderTracking />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/Terms&Services" element={<PrivacyPolicy />} />
          <Route path="/shippingpolicy" element={<PrivacyPolicy />} />
          <Route path="/return" element={<Return />} />
          <Route path="/faq" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
