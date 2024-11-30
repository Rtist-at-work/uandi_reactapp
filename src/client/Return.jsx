import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { AiOutlineCheckCircle } from "react-icons/ai"; // Importing success icon

const Return = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);
  const [orderid, setOrderId] = useState(""); // State for Order ID
  const [email, setEmail] = useState(""); // State for Email
  const [reason, setReason] = useState(""); // State for Reason
  const [showPopup, setShowPopup] = useState(false); // State for Popup

  // Fetch categories
  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data.category);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getCategory();
  }, []);

  // Handle form submission
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if(!orderid || !email || !reason) alert("fill all the fileds")
    try {
      const response = await axios.post(`${URI}/returnRequest`, {
        orderid,
        email,
        reason,
      });

      if (response.status === 200) {
        setShowPopup(true); // Show popup on success
        setOrderId(""); // Clear the form after submission
        setEmail("");
        setReason("");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="h-screen w-screen">
      <Header />

      <main className="relative h-[85%] w-full overflow-y-auto overflow-x-hidden">
        {/* Category Navigation */}
        <div className="h-6 lg:h-12 w-full flex bg-blue-300 gap-4 px-4 justify-around items-center z-10">
          {categoryList && categoryList.length > 0 ? (
            categoryList.map((category) => (
              <div key={category.category} className="relative group z-30">
                <a className="cursor-pointer text-gray-900">
                  {category.category}
                </a>
                <ul className="absolute left-0 hidden group-hover:block bg-white border z-50 min-w-max transition duration-3000 ease-out hover:ease-in rounded shadow-lg">
                  {category.style.length > 0 ? (
                    category.style.map((style) => (
                      <li
                        key={style.style}
                        className="px-4 py-2 cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/productpage?categorynav=${category.category}&stylenav=${style.style}`
                          )
                        }
                      >
                        {style.style}
                      </li>
                    ))
                  ) : (
                    <div>Styles not found</div>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div>No data</div>
          )}
        </div>

        {/* Policy Content */}
        <div className="max-h-max w-full px-8 sm:px-16 lg:px-32 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Return Request
          </h1>
          <p className="text-center text-gray-500 text-base">
            Enter your order ID and email/phone number to find your order
          </p>
        </div>
        <form
          onSubmit={handleFormSubmission}
          className="max-h-max lg:w-[50%] md:w-[70%] xsm:w-[90%] shadow-md mx-auto p-8 rounded bg-white"
        >
          <label
            htmlFor="orderid"
            className="block text-sm font-medium text-gray-500"
          >
            Order ID
          </label>
          <input
            type="text"
            required
            id="orderid"
            value={orderid}
            onChange={(e) => setOrderId(e.target.value)}
            className="h-12 mt-2 outline-blue-500 w-full mb-6 px-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-500"
          >
            Email
          </label>
          <input
            type="text"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 mt-2 outline-blue-500 w-full mb-6 px-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-500"
          >
            Reason
          </label>
          <textarea
            id="reason"
            value={reason}
            required
            onChange={(e) => setReason(e.target.value)}
            className="h-24 mt-2 outline-blue-500 w-full mb-6 px-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          <button
            type="submit"
            className="h-12 w-full bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </form>

        {/* Popup */}
        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white w-[90%] sm:w-96 p-6 rounded-lg shadow-lg">
              {/* Success Icon */}
              <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              {/* Success Message */}
              <h2 className="text-lg font-bold text-gray-800 text-center">
                Request Submitted Successfully!
              </h2>
              <p className="text-gray-600 text-center text-sm mt-2">
              Our customer support team will review it and reach out to you soon.
              </p>
              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => navigate("/")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
};

export default Return;
