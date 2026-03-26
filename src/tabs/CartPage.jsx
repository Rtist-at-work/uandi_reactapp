import { toast } from "sonner";
import CartItem from "../cartPage/CartItem";
import CartSummary from "../cartPage/CartSummary";
import EmptyCart from "../cartPage/EmptyCart";
import { useCallback, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import Breadcrumb from "../components/BreadCrumb";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [eligibleCoupons, setEligibleCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getJsonApi, patchApi } = useApi();
  const url = import.meta.env.VITE_API_URL;

  const calculateFinalPrice = (price, offer, offerType) => {
    if (!offer) return price;
    if (offerType === "percentage") return price - (price * offer) / 100;
    if (offerType === "flat") return price - offer;
    return price;
  };

  // -------------------------
  // Get Cart
  // -------------------------
  const getCart = useCallback(async () => {
    try {
      const response = await getJsonApi("api/getCart", "application/json");
      console.log(response);
      if (response.status === 200) {
        const payload = response.data.cart;
        const formatted = payload.cart.map((item) => {
          const p = item.product;
          return {
            _id: p._id,
            name: p.name,
            price: calculateFinalPrice(p.price, p.offer, p.offertype),
            originalPrice: p.price,
            qty: item.quantity,
            size: item.size,
            color: "#000000",
            image: `${url}/api/mediaDownload/${p.productImages[0]}`,
          };
        });
        setCartItems(formatted);
        setEligibleCoupons(payload.eligibleCoupons || []);
      }
    } catch (err) {
      console.log("Get Cart Error:", err);
      // toast.error("Failed to load cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getJsonApi, url]);

  useEffect(() => {
    getCart();
  }, []);

  // -------------------------
  // Update Quantity
  // -------------------------
  const updateQty = async (id, newQty, size) => {
    try {
      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, qty: newQty } : item)),
      );

      await patchApi(
        "api/updateCart",
        { productId: id, size, quantity: newQty },
        "application/json",
      );

      toast.success("Cart updated successfully!");
    } catch (err) {
      console.log("Update Cart API Error:", err);
      toast.error("Failed to update cart. Please try again.");
      getCart(); // refresh cart on error
    }
  };

  // -------------------------
  // Remove Item
  // -------------------------
  const removeItem = async (id, size) => {
    try {
      console.log("id , size :", id, size);
      console.log("cartItems :", cartItems);
      setCartItems((prev) =>
        prev.filter((item) => !(item._id === id && item.size === size)),
      );

      await patchApi(
        "api/updateCart",
        { productId: id, size, quantity: 0 },
        "application/json",
      );

      toast.success("Item removed from cart!");
    } catch (err) {
      console.log("Remove Cart API Error:", err);
      toast.error("Failed to remove item. Please try again.");
      getCart(); // refresh cart on error
    }
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!loading && cartItems.length === 0) return <EmptyCart />;

  return (
    <>
      <Breadcrumb />

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          {loading
            ? [...Array(3)].map((_, i) => <CartItem key={i} loading />)
            : cartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  updateQty={(id, qty) => updateQty(id, qty, item.size)}
                  removeItem={(id) => removeItem(id, item.size)}
                />
              ))}
        </div>

        <CartSummary
          loading={loading}
          cartItems={cartItems}
          eligibleCoupons={eligibleCoupons}
          appliedCoupon={appliedCoupon}
          setAppliedCoupon={setAppliedCoupon}
        />
      </div>
    </>
  );
};

export default CartPage;
