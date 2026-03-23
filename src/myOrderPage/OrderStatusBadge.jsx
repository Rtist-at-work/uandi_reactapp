import React from "react";

const statusStyles = {
  Delivered: "bg-green-100 text-green-700 border-green-300",
  Shipped: "bg-blue-100 text-blue-700 border-blue-300",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Cancelled: "bg-red-100 text-red-700 border-red-300",
};

const OrderStatusBadge = ({ status }) => {
  return (
    <span
      className={`text-xs px-3 py-1 border rounded-full font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

export default OrderStatusBadge;
