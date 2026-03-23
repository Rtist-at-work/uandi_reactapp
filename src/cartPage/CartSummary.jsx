import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import useApi from "../hooks/useApi";
import { useCallback, useState } from "react";

const CartSummary = ({
  cartItems,
  eligibleCoupons,
  appliedCoupon,
  setAppliedCoupon,
  loading,
}) => {
  const navigate = useNavigate();
  const { postJsonApi } = useApi();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // -------------------------------
  // CALCULATIONS
  // -------------------------------
  const totalMRP = Math.round(
    cartItems.reduce((acc, item) => acc + item.originalPrice * item.qty, 0)
  );

  const totalPrice = Math.round(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  const productDiscount = totalMRP - totalPrice;

  let couponDiscount = 0;
  if (appliedCoupon) {
    couponDiscount =
      appliedCoupon.type === "percentage"
        ? Math.round((totalPrice * appliedCoupon.discountValue) / 100)
        : appliedCoupon.discountValue;
  }

  const finalAmount = Math.max(totalPrice - couponDiscount, 0);

  // -------------------------------
  // SAVE CART SUMMARY API
  // -------------------------------
  const saveCartSummary = useCallback(async () => {
    setCheckoutLoading(true);
    try {
      const body = {
        subtotal: totalMRP,
        productDiscount,
        appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
        couponDiscount,
        finalAmount,
      };

      const res = await postJsonApi("api/cart/saveSummary", body);
      if (res.status === 200) navigate("/checkout");
    } catch (err) {
      console.log("Error saving summary", err);
    } finally {
      setCheckoutLoading(false);
    }
  }, [
    totalMRP,
    productDiscount,
    appliedCoupon,
    finalAmount,
    couponDiscount,
    navigate,
    postJsonApi,
  ]);

  // -------------------------------
  // LOADING SKELETON
  // -------------------------------
  if (loading) {
    return (
      <div className="border rounded-xl p-5 shadow-md sticky top-20 h-fit">
        <Skeleton width={150} height={28} className="mb-4" />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <Skeleton height={20} />
        <hr className="my-3" />
        <Skeleton height={28} width="60%" />
        <Skeleton height={48} width="100%" className="mt-5" />
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-5 shadow-md sticky top-20 h-fit bg-white">
      {/* COUPON SECTION */}
      <h2 className="text-lg font-semibold mb-3">Apply Coupon</h2>

      <div className="mb-4">
        {eligibleCoupons.length === 0 ? (
          <p className="text-gray-500 text-sm">No coupons available.</p>
        ) : (
          eligibleCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className="border p-3 rounded-lg mb-2 bg-gray-50 flex justify-between"
            >
              <div>
                <p className="font-bold text-black">{coupon.couponName}</p>
                <p className="text-gray-600 text-xs">{coupon.description}</p>
                <p className="text-green-600 font-semibold mt-1">
                  {coupon.type === "percentage"
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} OFF`}
                </p>
              </div>

              {appliedCoupon?.code === coupon.code ? (
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="px-3 py-1 bg-red-500 h-fit  text-white rounded-lg text-xs"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => setAppliedCoupon(coupon)}
                  className="px-3 py-1 h-fit bg-black text-white rounded-lg text-xs"
                >
                  Apply
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <hr className="my-4" />

      {/* PRICE DETAILS */}
      <h2 className="text-xl font-semibold mb-4">Price Details</h2>

      <div className="flex justify-between py-1">
        <span>Total MRP</span>
        <span>₹{totalMRP}</span>
      </div>

      <div className="flex justify-between py-1">
        <span>Discount</span>
        <span className="text-green-600">-₹{productDiscount}</span>
      </div>

      {appliedCoupon && (
        <div className="flex justify-between py-1">
          <span className="text-green-700 font-medium">
            Coupon ({appliedCoupon.code})
          </span>
          <span className="text-green-700">-₹{couponDiscount}</span>
        </div>
      )}

      <div className="flex justify-between py-1">
        <span>Delivery Charges</span>
        <span className="text-green-600">FREE</span>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between font-bold text-lg">
        <span>Total Amount</span>
        <span>₹{finalAmount}</span>
      </div>

      <button
        onClick={saveCartSummary}
        disabled={checkoutLoading}
        className="w-full py-3 bg-black text-white rounded-xl mt-5 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {checkoutLoading && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        )}
        <span>{checkoutLoading ? "Processing..." : "Proceed to Checkout"}</span>
      </button>
    </div>
  );
};

export default CartSummary;
