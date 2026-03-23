import { useState, useMemo, useCallback, useEffect } from "react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Breadcrumb from "../components/BreadCrumb";

const CheckoutPage = () => {
  const { postJsonApi, patchApi, getJsonApi } = useApi();
  const navigate = useNavigate();

  // STATES
  const [appliedCoupon, setAppliedCoupon] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [cartSummary, setCartSummary] = useState(null);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    type: "home",
  });
  // ================================
  // FETCH CART SUMMARY + ADDRESSES
  // ================================
  const getCartSummary = useCallback(async () => {
    try {
      const res = await getJsonApi("api/getCartSummary", "application/json");
      console.log("res :", res);
      if (res.status === 200) {
        setAddresses(res.data.addresses || []);
        setCartSummary(res.data.cartSummary || null);
        setAppliedCoupon(res.data?.appliedCoupon || []);

        // Auto-select first address
        if (res.data.addresses.length > 0) {
          const home = res.data.addresses.find((x) => x.type === "home");
          setSelectedAddress(home || res.data.addresses[0]);
        }
      }
    } catch (err) {
      console.log("Error fetching summary:", err);
    }
  }, [getJsonApi]);

  useEffect(() => {
    getCartSummary();
  }, []);

  // ================================
  // SAVE OR UPDATE ADDRESS
  // ================================
  const handleSaveAddress = useCallback(async () => {
    for (const key in newAddress) {
      if (!newAddress[key]) {
        toast.error("Please fill all fields");
        return;
      }
    }

    try {
      let response;

      if (editingAddressId) {
        response = await patchApi(
          `api/updateaddress/${editingAddressId}`,
          newAddress,
          "application/json"
        );
      } else {
        response = await postJsonApi(
          "api/postaddress",
          newAddress,
          "application/json"
        );
      }

      if (response.status === 200) {
        await getCartSummary(); // refresh addresses
      }
    } catch (err) {
      console.log("Address Error:", err);
    }

    setShowAddressForm(false);
    setEditingAddressId(null);

    setNewAddress({
      name: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      type: "home",
    });
  }, [newAddress, editingAddressId, postJsonApi, patchApi, getCartSummary]);

  // ================================
  // PLACE ORDER
  // ================================
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    const payload = {
      address: selectedAddress,
      paymentMethod,
      ...cartSummary,
    };

    setOrderLoading(true);

    try {
      const res = await postJsonApi("api/place-order", payload);

      if (res.status === 200) {
        navigate("/my-orders");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setOrderLoading(false);
    }
  };

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <>
      {" "}
      <Breadcrumb />
      <div className="max-w-5xl mx-auto p-4 md:p-6 grid md:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="md:col-span-2 space-y-6">
          {/* ================== ADDRESS SECTION ================== */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>

            {/* Show Saved Addresses */}
            {addresses.length === 0 ? (
              <p className="text-gray-500">No saved addresses. Add one.</p>
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  className={`border p-3 rounded-lg cursor-pointer mb-2 flex justify-between items-start ${
                    selectedAddress?._id === addr._id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedAddress(addr)}
                >
                  <div className="flex justify-between items-start w-full">
                    <div>
                      <h4 className="font-medium">
                        {addr.name} • {addr.phone}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                        {addr.pincode}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          addr.type === "home"
                            ? "bg-green-100 text-green-800"
                            : addr.type === "work"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {addr.type.toUpperCase()}
                      </span>

                      <button
                        className="text-white bg-blue-600 hover:bg-blue-700 transition-all px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAddressId(addr._id);
                          setNewAddress({ ...addr });
                          setShowAddressForm(true);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {!showAddressForm && (
              <button
                className="mt-3 w-full border border-blue-500 text-blue-500 rounded-lg p-2 hover:bg-blue-50"
                onClick={() => setShowAddressForm(true)}
              >
                + Add New Address
              </button>
            )}

            {/* ADD / EDIT FORM */}
            {showAddressForm && (
              <div className="mt-4 p-5 rounded-2xl border border-gray-300 bg-white/70 backdrop-blur-sm shadow-lg">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  {editingAddressId ? "Edit Address" : "Add New Address"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {["name", "phone", "city", "state", "pincode"].map(
                    (field) => (
                      <div className="flex flex-col gap-1" key={field}>
                        <label className="text-sm font-medium text-gray-600">
                          {field.toUpperCase()}
                        </label>
                        <input
                          type="text"
                          className="border border-gray-300 outline-none p-3 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                          value={newAddress[field]}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              [field]: e.target.value,
                            })
                          }
                        />
                      </div>
                    )
                  )}

                  {/* Address Line */}
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">
                      Address Line
                    </label>
                    <input
                      type="text"
                      className="border outline-none border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={newAddress.addressLine}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          addressLine: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Address Type */}
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-600">
                      Address Type
                    </label>
                    <select
                      className="border border-gray-300 p-3 outline-none cursor-pointer rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm"
                      value={newAddress.type}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, type: e.target.value })
                      }
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    className="flex-1 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl py-2.5 hover:bg-gray-200"
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddressId(null);
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5"
                    onClick={handleSaveAddress}
                  >
                    Save Address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PAYMENT METHOD */}
          <div className="bg-white shadow-md rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3">Payment Method</h2>
            <div className="space-y-3">
              {["COD", "UPI", "CARD"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>
                    {method === "COD" && "Cash On Delivery"}
                    {method === "UPI" && "UPI / GPay / PhonePe"}
                    {method === "CARD" && "Debit / Credit Card"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ================== RIGHT SUMMARY ================== */}
        <div className="bg-white shadow-md rounded-xl p-4 h-fit">
          <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

          {!cartSummary ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{cartSummary.subtotal}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{cartSummary.productDiscount}</span>
              </div>

              {/* APPLIED COUPON UI */}
              {cartSummary?.appliedCoupon && (
                <div className="flex justify-between items-center bg-green-50 border border-green-300 p-3 rounded-lg mt-2">
                  <div>
                    <p className="text-green-800 font-semibold tracking-wide">
                      🎉 Applied Coupon: {cartSummary.appliedCoupon}
                    </p>
                    <p className="text-green-700 text-sm font-medium">
                      You saved ₹{cartSummary.couponDiscount}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between border-t pt-2 font-semibold text-base">
                <span>Total Amount</span>
                <span>₹{cartSummary.finalAmount}</span>
              </div>
            </div>
          )}

          {/* PLACE ORDER BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={orderLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl py-3 mt-4 font-medium flex items-center justify-center gap-2"
          >
            {orderLoading ? (
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
