import axios from "axios";
import Footer from "./mobile components/Footer";
import { io } from "socket.io-client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orderlist = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [socketInstance, setSocketInstance] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("orderPlaced"); // Default status
  const [searchQuery, setSearchQuery] = useState("");
  const [returnRequest, setReturnRequest] = useState([]);
  const filterOrdersBySearch = (query) => {
    setSearchQuery(query);
    const filtered = orders.filter((order) => {
      // Check if the orderId contains the search query
      return order.orderId.toString().includes(query);
    });
    setFilteredOrders(filtered);
  };
  const navigate = useNavigate();
  useEffect(() => {
    const socketInstance = io(URI, {
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log(`Socket connected: ${socketInstance.id}`);
    });

    socketInstance.on("auth_error", (data) => {
      alert(data.message); // Example action
      navigate("/login"); // Redirect to login page or another action
    });

    setSocketInstance(socketInstance);
    fetchOrders();

    return () => {
      socketInstance.disconnect();
    };
  }, []); // Empty dependency array to run once on mount

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${URI}/admin/orders`);
      setOrders(response.data.orders);
      setReturnRequest(response.data.rr);
      const filtered = response.data.orders.filter(
        (order) =>
          order.status === "orderplaced" || order.status === "orderPlaced"
      );

      setFilteredOrders(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to filter orders based on selected status
  const filterOrdersByStatus = (status) => {
    setSelectedStatus(status);
    const filtered = orders.filter((order) => order.status === status);
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (value, orderId, userId, index) => {
    console.log(userId);
    const data = {
      value: value,
      orderId: orderId,
      userId: userId,
    };

    try {
      if (socketInstance.connected) {
        // Emit the event to update order status
        socketInstance.emit("orderStatusUpdation", data);

        // Listen for success response
        socketInstance.on("status_update_success", (response) => {
          let updatedOrder = [...orders];
          updatedOrder[index].status = response.value;
          setOrders(updatedOrder);
          filterOrdersByStatus(selectedStatus); // Re-filter based on current status
        });

        // Listen for error response
        socketInstance.on("status_update_error", (error) => {
          console.error("Error updating order status:", error.message);
        });
      } else {
        console.log("Socket not connected.");
      }
    } catch (err) {
      console.log("Error in handleStatusChange:", err);
    }
  };

  return (
    <div className="absolute h-[90%] w-full bg-white-800 rounded-md shadow-md">
      <main className="p-1 overflow-y-auto xsm:h-[95%] md:h-full w-full scrollbar-hidden">
        <div className="max-h-max w-full bg-pink-300 flex gap-4 overflow-x-auto items-center justify-around p-2 ">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => filterOrdersBySearch(e.target.value)}
            placeholder="Search by Order ID"
            className="w-full max-w-[250px] p-2 mt-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="order-status"
            className="text-sm font-semibold text-gray-700"
          >
            Order Status
          </label>
          <select
            id="order-status"
            value={selectedStatus}
            onChange={(e) => filterOrdersByStatus(e.target.value)}
            className="w-full max-w-[250px] p-2 mt-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="orderPlaced" className="text-sm">
              Order Placed
            </option>
            <option value="shipped" className="text-sm">
              Shipped
            </option>
            <option value="out for delivery" className="text-sm">
              Out for delivery
            </option>
            <option value="delivered" className="text-sm">
              Delivered
            </option>
            <option value="cancelled" className="text-sm">
              Cancelled
            </option>
            <option value="returnRequested" className="text-sm">
              Return Request
            </option>
          </select>
        </div>
        {[
          "orderPlaced",
          "shipped",
          "out for delivery",
          "delivered",
          "cancelled",
        ].includes(selectedStatus) && (
          <div className="overflow-x-auto max-w-full">
            <table className="w-full max-h-max bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-xs md:text-base">
                  <th className="text-left px-4 py-3 bg-green-200 min-w-[100px]">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 bg-blue-200 min-w-[100px]">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 bg-pink-200 min-w-[200px]">
                    Products
                  </th>
                  <th className="text-left px-4 py-3 bg-blue-200 min-w-[100px]">
                    Price
                  </th>
                  <th className="text-left px-4 py-3 bg-blue-200 min-w-[100px]">
                    Coupon Applied
                  </th>
                  <th className="text-left px-4 py-3 bg-green-200 min-w-[150px]">
                    Payment Method
                  </th>
                  <th className="text-left px-4 py-3 bg-yellow-300 min-w-[200px]">
                    Delivery Address
                  </th>
                  <th className="text-left px-4 py-3 bg-pink-300 min-w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders && filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr
                      key={order.orderId}
                      className="border-t text-xs md:text-base"
                    >
                      <td className="px-4 py-4 truncate">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 truncate">{order.orderId}</td>
                      <td className="px-4 py-4">
                        {order.product.map((product, idx) => (
                          <div key={idx} className="mb-1 truncate">
                            <span className="font-semibold">
                              {product.product.name || "Details not available"}
                            </span>
                            <br />
                            <span className="text-xs text-gray-500">
                              [{product.selectedSize}, color]
                            </span>{" "}
                            - {product.count} pcs
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-4 truncate">{order.price}</td>
                      <td className="px-4 py-4 truncate">
                        {order.coupon || "None"}
                      </td>
                      <td className="px-4 py-4 truncate">
                        {order.paymentMethod || "N/A"}
                      </td>
                      <td className="px-4 py-4 truncate">
                        {order.deliveryaddress.address}
                        <br />
                        {order.deliveryaddress.addressType}{" "}
                        {order.deliveryaddress.landmark}{" "}
                        {order.deliveryaddress.locality}{" "}
                        {order.deliveryaddress.city}-
                        {order.deliveryaddress.pincode}
                        <br />
                        {order.deliveryaddress.state}
                      </td>
                      <td className="px-4 py-4">
                        <select
                          className="py-1 px-2 md:px-3 rounded-full text-xs md:text-sm border border-gray-300 bg-white"
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              e.target.value,
                              order.orderId,
                              order.userId,
                              index
                            )
                          }
                        >
                          <option value="orderPlaced">Order Placed</option>
                          <option value="shipped">Shipped</option>
                          <option value="out for delivery">
                            Out for delivery
                          </option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {selectedStatus === "returnRequested" && (
          <div className="overflow-x-auto max-w-full p-4">
            <table className="w-full table-auto bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="text-left px-4 py-3 min-w-[150px]">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 min-w-[150px]">
                    Requested Date
                  </th>
                  <th className="text-left px-4 py-3 min-w-[200px]">Reason</th>
                  <th className="text-left px-4 py-3 min-w-[150px]">Email</th>
                  <th className="text-left px-4 py-3 min-w-[150px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Assuming `returnRequest` is the array containing the data */}
                {returnRequest.length > 0 ? (
                  returnRequest.map((request, index) => (
                    <tr key={request._id} className="border-t text-sm">
                      <td className="px-4 py-3">{request.orderid}</td>
                      <td className="px-4 py-3">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 truncate">{request.reason}</td>
                      <td className="px-4 py-3">{request.email}</td>
                      <td className="px-4 py-3 flex space-x-2">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
                          onClick={() => handleAccept(request._id)}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                          onClick={() => {
                            setPopup(true)
                            handleDispute(request._id)
                          }}
                        >
                          Dispute
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No return requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <footer className="h-[5%] w-full md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};

export default Orderlist;
