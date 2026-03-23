import React from "react";
import { useNavigate } from "react-router-dom";
const EmptyCart = () => {

  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <img
        src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
        alt="empty"
        className="w-40 opacity-80"
      />
      <h2 className="text-2xl font-semibold mt-4">Your Cart is Empty</h2>
      <p className="text-gray-600 mt-1">Add items to your cart to continue.</p>

      <button onClick={()=>navigate('/')} className="mt-6 px-6 py-3 bg-black text-white rounded-xl">
        Continue Shopping
      </button>
    </div>
  );
};

export default EmptyCart;
