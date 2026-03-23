import { useCallback, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { FaStar } from "react-icons/fa";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { toast } from "sonner";
import Breadcrumb from "../components/BreadCrumb";

const MyOrdersPage = () => {
  const url = import.meta.env.VITE_API_URL;
  const { getJsonApi, postJsonApi } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [reviewPopup, setReviewPopup] = useState(false);
  const [reviewData, setReviewData] = useState({
    productId: "",
    rating: 0,
    comment: "",
  });

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await getJsonApi("api/my-orders");
      if (res.status === 200) setOrders(res.data.data);
    } catch (err) {
      console.log("Fetch Orders Error:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Open review popup
  const openReviewPopup = (productId) => {
    setReviewData({ productId, rating: 0, comment: "" });
    setReviewPopup(true);
  };

  // Submit review
  const submitReview = useCallback(async () => {
    if (!reviewData.rating || !reviewData.comment) {
      toast.error("Please fill all fields");
      return;
    }

    setReviewLoading(true);
    try {
      const res = await postJsonApi("api/addReview", reviewData);
      if (res.status === 200) {
        setReviewPopup(false);
        fetchOrders(); // Refresh orders to show review status if needed
      }
    } catch (err) {
      console.log("Review Error:", err);
      toast.error("Review submission failed!");
    } finally {
      setReviewLoading(false);
    }
  }, [reviewData, postJsonApi, fetchOrders]);

  // ------------------------------------------
  // Loading skeleton
  // ------------------------------------------
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-5">
        <Skeleton width={200} height={40} />
        <div className="space-y-6 mt-6">
          {[1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: 1,
              }}
            >
              <Skeleton width="40%" height={28} />
              <Skeleton width="25%" height={24} sx={{ mt: 1 }} />
              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
              >
                {[1, 2].map((j) => (
                  <Box key={j} sx={{ display: "flex", gap: 2 }}>
                    <Skeleton
                      variant="rectangular"
                      width={90}
                      height={90}
                      sx={{ borderRadius: "12px" }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="60%" height={24} />
                      <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
                      <Skeleton width="30%" height={32} sx={{ mt: 2 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // Actual Page
  // ------------------------------------------
  return (
    <>
      {" "}
      <Breadcrumb />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-3xl font-bold">My Orders</h2>

          <p className="text-sm text-gray-500 mt-1 sm:mt-0">
            {orders.length} orders placed
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Order #{order.orderId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full
                ${
                  order.orderStatus === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              {/* Order Items */}
              <div className="divide-y">
                {order.items.map((item) => (
                  <div
                    key={item.product}
                    className="flex flex-col sm:flex-row gap-4 px-6 py-4"
                  >
                    {/* Product Image */}
                    <img
                      src={`${url}/api/mediaDownload/${item.image}`}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover border"
                    />

                    {/* Product Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>

                      <p className="text-sm text-gray-600 mt-1">
                        Qty: {item.quantity} • Size: {item.size}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center">
                      <button
                        onClick={() => openReviewPopup(item.product)}
                        className="px-4 py-2 text-sm font-medium rounded-lg
                      border border-blue-600 text-blue-600
                      hover:bg-blue-600 hover:text-white transition"
                      >
                        Write Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 flex justify-between rounded-b-2xl">
                <span>Need help with this order?</span>
                <button className="text-blue-600 font-medium hover:underline">
                  Contact Support
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Review Popup (UNCHANGED) */}
        {reviewPopup && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white w-96 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-xl font-semibold">Write a Review</h3>

              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={28}
                    className={`cursor-pointer ${
                      star <= reviewData.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() =>
                      setReviewData({ ...reviewData, rating: star })
                    }
                  />
                ))}
              </div>

              <textarea
                className="border p-3 rounded-xl w-full h-28 resize-none"
                placeholder="Write your comments..."
                value={reviewData.comment}
                onChange={(e) =>
                  setReviewData({
                    ...reviewData,
                    comment: e.target.value,
                  })
                }
              />

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-gray-200 py-2 rounded-lg font-medium"
                  onClick={() => setReviewPopup(false)}
                >
                  Cancel
                </button>

                <button
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium disabled:opacity-60"
                  onClick={submitReview}
                  disabled={reviewLoading}
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;
