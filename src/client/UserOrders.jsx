import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaChevronRight, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FaStar } from "react-icons/fa6";
import Header from "./Header";

const UserOrders = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [orderDetails, setOrderDetails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const socketInstance = io(URI, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log(`Socket connected: ${socketInstance.id}`);
    });

    socketInstance.on("auth_error", (data) => {
      alert(data.message);
      navigate("/login");
    });

    socketInstance.on("orderStatusUpdated", ({ orderId, newStatus }) => {
      if (orderDetails) {
        // Use find instead of filter to get a single object
        let order = orderDetails.find((order) => order.orderId === orderId);

        if (order) {
          // Update the status of the found order
          order.status = newStatus;

          // Update the state with the modified orderDetails array
          setOrderDetails((prevOrders) =>
            prevOrders.map((prevOrder) =>
              prevOrder.orderId === orderId
                ? { ...prevOrder, status: newStatus }
                : prevOrder
            )
          );
        }
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(`${URI}/placeOrder/orderDetails`);
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setOrderDetails(response.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    getOrders();
  }, []);

  const getTrackingSteps = (status) => {
    if (status.toLowerCase() === "cancelled") {
      return ["Order Placed", "Cancelled"];
    }
    return ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
  };

  const getStepIndex = (status) => {
    switch (status.toLowerCase()) {
      case "order placed":
        return 0;
      case "shipped":
        return 1;
      case "out for delivery":
        return 2;
      case "delivered":
        return 3;
      case "cancelled":
        return 1;
      default:
        return 0;
    }
  };
  return (
    <div className="relative h-screen w-full scrollbar-hidden">
      <Header />
      <main className="absolute h-[85%] w-full overflow-y-auto overflow-x-auto mb-8 md:p-2 scrollbar-hidden xsm:p-4">
        <h1 className="md:ml-8 xxsm:w-[90%] md:w-[80%] md:p-4 xsm:py-4 font-semibold md:text-xl xsm:text-base">
          YOUR ORDERS
        </h1>
        {orderDetails.length > 0 ? (
          orderDetails.map((order) => {
            const steps = getTrackingSteps(order.status);
            const currentStep = getStepIndex(order.status);
            let k = 0;
            return (
              <div
                key={order._id}
                className="relative flex flex-col justify-between w-[90%] md:w-[80%] mx-auto shadow-md p-4 mb-8 rounded"
                onClick={() => navigate(`/ordertracking/${order.orderId}`)}
              >
                {/* Order Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg sm:text-base xsm:text-sm">
                    Order ID: {order.orderId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Product Images */}
                <div className="relative min-h-24  w-full  flex  flex-wrap gap-4 mb-4">
                  {order.productDetails?.map((product, ind) => {
                    let imgIndex = 0;
                    product.product.images.map((img, ind) => {
                      if (img[1][0].colorname === product.selectedColor)
                        imgIndex = ind;
                    });
                    k = k + 2;
                    return (
                      <div
                        key={product._id}
                        className={`absolute w-24 h-24  rounded-md flex-shrink-0 overflow-hidden ml-${k} mt-${k}`}
                      >
                        <img
                          src={
                            product.product?.images?.[imgIndex][0][0] ||
                            "default_image_url"
                          }
                          alt={product.product?.name || "Image not available"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Order Status or Tracking */}
                {order.status.toLowerCase() !== "delivered" &&
                order.status.toLowerCase() !== "cancelled" ? (
                  <div className="flex justify-center items-center w-full md:w-[70%] mx-auto mt-4">
                    <div className="flex justify-between items-center w-full">
                      {steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex flex-col justify-start items-center w-[25%] relative"
                        >
                          {/* Step Circle */}
                          <div
                            className={`w-[40px] h-[40px] xsm:w-[30px] xsm:h-[30px] rounded-full flex items-center justify-center text-white transition-colors duration-300 ${
                              index <= currentStep
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          >
                            {index < currentStep ? (
                              <FaCheck className="text-lg" />
                            ) : (
                              index + 1
                            )}
                          </div>

                          {/* Step Label */}
                          <p
                            className={`text-sm mt-2 xsm:text-xs ${
                              index <= currentStep
                                ? "text-green-500"
                                : "text-gray-400"
                            }`}
                          >
                            {step}
                          </p>

                          {/* Step Line */}
                          {index < steps.length - 1 && (
                            <div
                              className={`absolute top-1/2 left-full h-1 w-full transition-all duration-300 ${
                                index < currentStep
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                              style={{ transform: "translateX(-50%)" }}
                            ></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-4 w-full md:w-[70%] mx-auto">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${
                          order.status.toLowerCase() === "delivered"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <p
                        className={`text-sm sm:text-xs ${
                          order.status.toLowerCase() === "delivered"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {order.status} on delivery date
                      </p>
                    </div>

                    {/* Additional Info */}
                    <p className="text-gray-500 text-sm xsm:text-xs text-center">
                      Item has been delivered on the expected date
                    </p>

                    {/* Rate & Review */}
                    {order.status.toLowerCase() === "delivered" && (
                      <p className="text-sm sm:text-xs text-blue-500 flex items-center gap-2 hover:text-green-500 cursor-pointer">
                        <FaStar className="text-blue-500 hover:text-green-500" />
                        Rate & Review Product
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 text-lg sm:text-base">
            No orders available.
          </div>
        )}
      </main>
    </div>
  );
};

export default UserOrders;
