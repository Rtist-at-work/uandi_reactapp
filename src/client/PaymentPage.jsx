import React, { useState, useEffect } from 'react';
import uandiLogo from "../assets/uandilogo.jpg";
import { Link } from 'react-router-dom';
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useLocation  } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const navigate = useNavigate(); // Use navigate from React Router v6
  const order = JSON.parse(localStorage.getItem('order'))
  console.log(order)
  // Extracting data passed via location.state
  const orderSummary = order.orderSummary;
  const deliveryAddress = order.address;
  const subTotal = order.subTotal;
  const coupon = order.coupon;
  const [OrderId, setOrderId] = useState();
  const [ispaymentMethod, setIsPaymentMethod] = useState(false);
  const [orderCounter, setOrderCounter] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission
  const [paymentMethod, setPaymentMethod] = useState('');
  const [ordersToday, setOrdersToday] = useState(new Set());
console.log(coupon)
  // Handling the back button
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault(); // Prevent the default back button behavior
      navigate("/", { replace: true }); // Redirect to the homepage when back is pressed
    };

    window.history.pushState(null, "", window.location.href); // Push current state to history
    window.addEventListener("popstate", handleBackButton); // Listen for back button

    return () => {
      window.removeEventListener("popstate", handleBackButton); // Cleanup event listener
    };
  }, [navigate]);

  // Generate the Order ID
  const generateOrderId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const newOrderCounter = orderCounter + 1;
    setOrderCounter(newOrderCounter);
    const orderId = `${dateString}-${String(newOrderCounter).padStart(3, '0')}`;
    setOrderId(orderId);
    return orderId;
  };

  // Order ID management on component load
  useEffect(() => {
    const getOrderId = async () => {
      try {
        const response = await axios.get(`${URI}/placeOrder/orderId`);

        if (response.status === 200) {
          setOrderCounter(response.data.orderCount);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getOrderId();

    const now = new Date();
    const currentDateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (!ordersToday.has(currentDateKey)) {
      setOrderCounter(0);
      setOrdersToday(new Set([currentDateKey])); // Reset to today
    }
  }, [ordersToday]);

  // Handle order submission
  const handleOrderSubmission = async () => {
    if (!ispaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const orderId = generateOrderId(); // Get the generated order ID
    setIsSubmitting(true); // Disable button while order is being submitted

    try {
      const data = {
        orderId: orderId,
        deliveryAddress: deliveryAddress,
        orderSummary: orderSummary,
        coupon: coupon || '', // Use actual coupon if available
        subTotal: subTotal,
        paymentMethod: paymentMethod,
      };

      const response = await axios.post(`${URI}/placeOrder`, data);
      if (response.status === 200 || response.status === 201) {
        alert(response.data.message);
        localStorage.clear()
        navigate('/userorders', { replace: true });
      }

    } catch (err) {
      console.error("Error placing the order:", err);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable button after submission
    }
  };

//mmvml

  return (
    <div className='h-screen w-screen overflow-y-auto'>
      <header className="relative h-[15%] w-full bg-blue-300">
        <div className="h-[25%] w-full bg-pink-300 xsm:text-sm flex items-center justify-center">
          10% Discount on first purchase | Welcome
        </div>
        <div className="h-[75%] w-full bg-yellow-300 flex">
          <div className="h-full w-[30%] bg-pink-300 shrink-0">
            <img src={uandiLogo} alt="Uandi Logo" className="h-full w-full" />
          </div>
          <div className="h-full w-[70%] shrink-0">
            <CgProfile className="absolute text-3xl right-4 top-1/2" />
            <Link to="/cart">
              <MdOutlineShoppingCart className="absolute text-3xl right-16 top-1/2" />
            </Link>
          </div>
        </div>
      </header>
      <main className="max-h-max w-full overflow-y-auto">
        <div
        id='COD'
          className={`h-12 w-[90%] border-2 border-gray-300 mx-auto mt-2 rounded flex items-center px-2 ${ispaymentMethod ? "bg-green-100" : ""}`}
          onClick={(e) =>{
            setPaymentMethod(e.target.id)
            setIsPaymentMethod(!ispaymentMethod)
            }}
        >
          Cash on Delivery
        </div>
      </main>
      <footer className='h-[30%] w-full flex items-center justify-end px-2'>
      <div className="flex items-center justify-center">
      <button
        className={`h-12 w-24 rounded border-2 border-gray-300 bg-orange-500 text-white ${isSubmitting ? 'bg-gray-400' : 'bg-orange-500'}`}
        onClick={handleOrderSubmission}
        disabled={isSubmitting} // Disable the button when submitting
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></div>
            <span>Placing Order...</span>
          </div>
        ) : (
          'Place Order'
        )}
      </button>
    </div>
      </footer>
    </div>
  );
};

export default PaymentPage;
