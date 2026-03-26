import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import OrderStatusBadge from "./OrderStatusBadge";

const OrderItem = ({ order }) => {
  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
          Order #{order.orderId}
        </h3>
        <OrderStatusBadge status={order.status} />
      </div>

      <p className="text-sm text-gray-500 mt-1">Ordered on: {order.date}</p>

      <div className="mt-4 flex gap-4 items-center">
        {/* Thumbnail */}
        <LazyLoadImage
          src={order.image}
          alt="Product"
          className="w-20 h-20 object-cover rounded-lg border"
        />

        {/* Product Summary */}
        <div>
          <p className="font-semibold text-gray-800">{order.productName}</p>
          <p className="text-gray-600 text-sm">Qty: {order.quantity}</p>
          <p className="font-bold text-gray-900 mt-1">₹{order.amount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-4">
        <button className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300">
          View Details
        </button>

        {order.status === "Delivered" && (
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            Write a Review
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
