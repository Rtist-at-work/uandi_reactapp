import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiHome } from "react-icons/ci";
import { MdWorkOutline } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSolidOffer } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import Header from "./Header";

const OrderPage = ({ handleAddAddress }) => {
  const [address, setAddress] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [bgSelected, setBgSelected] = useState("");
  const [changeAddress, setChangeAddress] = useState(false);
  const [orderSummary, setOrderSummary] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [couponPopup, setCouponPopup] = useState(false);
  const [subTotal, setSubTotal] = useState();
  const [addressOpen, setAddressOpen] = useState(true);
  const [isOrderSummary, setIsOrderSummary] = useState(true);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const index = "";
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const handleexit = () => {
    localStorage.setItem(
      "order",
      JSON.stringify({ orderSummary, address, coupon, subTotal })
    );
    navigate("/paymentpage");

  };

  const handle = (e) => {
    const id = e.target.id;
    if (id === "address") setAddressOpen(!addressOpen);
    else if (id === "ordersummary") setIsOrderSummary(!isOrderSummary);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const cartResponse = await axios.get(`${URI}/auth/getCart`);
        console.log(cartResponse.data.address[0]);
        setOrderSummary(cartResponse.data.cart);
        setAddresses(cartResponse.data.address);
        if (cartResponse.data.address.length > 0) {
          setAddress(cartResponse.data.address[0]); // Set default address if exists
        }
        setCoupons(cartResponse.data.coupons);
        // setOrderSummarySend(response.data.productDetails);
      } catch (err) {
        console.log(err);
      }
    };
    // fetchAddress();
    fetchProductDetails();
  }, []);
  useEffect(() => {
    let newTotal = 0;
    let newDiscount = 0;

    if (orderSummary.length > 0) {
      newTotal = orderSummary.reduce(
        (acc, p) => acc + p.product.price * p.count,
        0
      );
      newDiscount = orderSummary.reduce((acc, p) => {
        if (p.product.offertype === "Flat offer") {
          return p.product.offer * p.count;
        } else {
          return acc + ((p.product.price * p.product.offer) / 100) * p.count;
        }
      }, 0);
    }
    const subtotal = newTotal - newDiscount;

    setSubTotal(parseFloat(subtotal.toFixed(2)));
    setTotal(parseFloat(newTotal.toFixed(2)));
    setDiscount(parseFloat(newDiscount.toFixed(2)));
  }, [orderSummary]);
  return (
    <div className="relative h-screen w-screen ">
      {couponPopup && (
  <div className="absolute inset-0 h-[50%] lg:w-[50%] xsm:w-[90%] z-50 py-4 rounded bg-gray-300 shadow-md border-gray-300 border-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <div className="relative xsm:w-[100%] max-h-max bg-blue-300 rounded  mx-auto mb-8">
      <ImCross
        className="absolute right-2 xsm:text-xs md:text-base text-red-500 cursor-pointer"
        onClick={() => {
          setCouponPopup(false);
        }}
      />
    </div>
    {coupons?.map((coupon, index) => {
      return Object.entries(coupon)[0][1] ? (
        <div
          key={index}
          className="xsm:w-[90%] max-h-max bg-gray-50 shadow-md rounded-lg mx-auto flex justify-between items-center overflow-hidden p-3 mt-3 md:text-lg xsm:text-sm transition-transform duration-150 hover:scale-105"
        >
          {/* Coupon Details */}
          <div className="flex flex-col items-start font-semibold">
            <div className="flex items-center space-x-2">
              <BiSolidOffer className="text-yellow-500 h-6 w-6" />
              <span className="text-gray-700">
                {String(Object.entries(coupon)[0][0]).toUpperCase()}
              </span>
            </div>
            <p className="text-green-700 mt-1 text-sm md:text-lg">
              25% Off on this order
            </p>
          </div>

          {/* Apply Button */}
          <button
            className="px-4 py-2 bg-orange-100 text-orange-500 font-semibold rounded-lg hover:bg-orange-200 transition-colors duration-150 md:text-base xsm:text-sm"
            onClick={() => {
              if (
                String(Object.entries(coupon)[0][0]).toLowerCase() ===
                "trynew"
              ) {
                setCoupon({ trynew: 25 });
                setCouponPopup(false);
              }
            }}
          >
            Apply
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center xsm:w-[90%] max-h-max bg-gray-50 shadow-md rounded-lg mx-auto p-3 mt-3">
          <p className="text-center text-gray-500">OOps! Coupons not available</p>
        </div>
      );
    })}
  </div>
)}

      <Header />

      <main className="relative h-[85%] max-w-full overflow-y-auto scrollbar-hidden md:px-8 xsm:px-4">
        {changeAddress && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[95%] max-w-max border-2 border-gray-300 p-6 bg-white shadow-lg rounded-lg z-10 overflow-y-auto bg-red-300  ">
            <div className="flex justify-between items-center ">
              <div className="font-bold text-blue-500 ">
                Select Delivery Address
              </div>
              <ImCross
                className="text-sm text-red-600 cursor-pointer"
                onClick={() => setChangeAddress(false)}
              />
            </div>

            {addresses.length > 0 ? (
              addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => setBgSelected(addr)}
                  className={` max-h-max max-w-max  p-4 ${
                    bgSelected === addr ? "bg-green-100" : ""
                  } adress-300 border-2 border-gray-400 my-4 rounded-lg hover:shadow-md cursor-pointer`}
                >
                  <div
                    className="relative flex items-center justify-end text-gray-500 gap-0.5"
                    onClick={(e) => {
                      handleAddAddress(e, index, "orderpage");
                    }}
                  >
                    <MdEdit className="text-xl cursor-pointer hover:text-blue-500 transition-colors duration-300" />
                  </div>

                  <div className="flex font-semibold mt-2">
                    <div>{addr.name}</div>
                    <div className="flex items-center text-blue-500 ml-12">
                      {addr.addressType === "Home" ? (
                        <CiHome className="text-gray-500" />
                      ) : (
                        <MdWorkOutline className="text-gray-500" />
                      )}
                      <span className="ml-1">{addr.addressType}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {`${addr.address}, ${addr.locality}, ${addr.landmark}, ${addr.city} - ${addr.pincode}`}
                  </div>
                  <div className="mt-2 font-bold">{addr.mobile}</div>
                </div>
              ))
            ) : (
              <div className="text-xl text-gray-500 flex justify-center items-center h-36">
                Please add an address
              </div>
            )}
            <div className="flex justify-end">
              <button
                className="max-h-max w-24 hover:shadow-lg p-2 rounded font-bold text-white bg-blue-500"
                onClick={() => {
                  setAddress(bgSelected);
                  setChangeAddress(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div
          id="address"
          onClick={handle}
          className="lg:w-[90%] xsm:w-full max-h-max font-semibold text-lg flex items-center m-2 justify-between "
        >
          Address <MdKeyboardArrowDown id="address" onClick={handle} />
        </div>
        {addressOpen && (
          <div className="relative h-16 lg:w-[90%] xsm:w-full flex items-center justify-end ">
            <button
              id="addAddress"
              className="absolute  border-2 rounded bg-blue-500 text-white p-2"
              onClick={(e) => {
                handleAddAddress(e, index, "orderpage");
              }}
            >
              Add address
            </button>
          </div>
        )}

        {addressOpen && addresses && addresses.length > 0 ? (
          <div className="max-h-max lg:w-[90%] xsm:w-full xsm:p-2 hover:shadow-md cursor-pointer rounded border-2 border-gray-400 lg:px-8 lg:py-4">
            <div className="flex justify-between words-break">
              <h1 className="font-semibold text-lg my-2 text-blue-500">
                Delivery Address
              </h1>
              <button
                onClick={() => setChangeAddress(true)}
                className="border-2 border-gray-300 bg-yellow-500 min-w-max max-h-max p-2 text-white text-sm font-bold rounded"
              >
                Change
              </button>
            </div>

            <div className="flex font-semibold mt-4">
              <div>{address.name}</div> {/* Show first address */}
              <div className="flex items-center ml-12">
                {address.addressType === "Home" ? (
                  <CiHome />
                ) : (
                  <MdWorkOutline />
                )}
                {address.addressType}
              </div>
            </div>

            <div className="mt-2 text-gray-500">
              {`${address.address} ${address.locality} ${address.landmark} ${address.city}-${address.pincode}`}
            </div>

            <div className="max-h-max min-w-max mt-2 font-bold">
              {address.mobile}
            </div>
          </div>
        ) : (
          addressOpen && (
            <div className="text-xl text-gray-500 flex justify-center items-center h-36">
              Please add an address
            </div>
          )
        )}

        {addressOpen ? "" : <hr />}

        <div>
          <div
            id="ordersummary"
            onClick={(e) => {
              handle(e);
            }}
            className="lg:w-[90%] xsm:w-full max-h-max font-semibold text-lg mt-8 flex items-center m-2 justify-between"
          >
            Order Summary{" "}
            <MdKeyboardArrowDown
              id="ordersummary"
              onClick={(e) => {
                handle(e);
              }}
            />
          </div>
          <div className="lg:grid lg:grid-cols-3 h-full lg:w-[90%] ">
            {isOrderSummary ? (
              <div className="max-h-max max-w-full px-2 mt-8 mb-12 lg:col-start-1 lg:col-span-2">
                {orderSummary.length > 0 ? (
                  <table className="w-full lg:w-[90%] table-auto">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2"></th>
                        <th className="p-2">Product</th>
                        <th className="p-2">Quantity</th>
                        <th className="p-2 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderSummary.map((p, index) => {
                        const product = p.product;
                        if (!product) return null;

                        return (
                          <tr key={index} className="border-t">
                            {/* Product Image */}
                            <td className="p-2 w-[40%]">
                              {product.images && product.images.length > 0 ? (
                                product.images.map((image, index) => {
                                  if (
                                    image[1][0].colorname === p.selectedColor
                                  ) {
                                    return (
                                      <img
                                        key={index}
                                        src={
                                          image[1][0].colorname ===
                                            p.selectedColor && image[0][0]
                                        }
                                        alt="product"
                                        className="h-20 w-20 border-2 border-gray-300 shadow-md rounded"
                                      />
                                    );
                                  }
                                })
                              ) : (
                                <div>No Image</div>
                              )}
                            </td>

                            {/* Product Details */}
                            <td className="p-2">
                              <div className="font-semibold  md:text-base xsm:text-sm  break-words">
                                {product.name.length > 30
                                  ? `${product.name.substring(0, 30)}...`
                                  : product.name}
                              </div>
                              {product.offer > 0 && (
                                <p className=" md:text-base xsm:text-sm  text-red-600 mt-1 flex items-center">
                                  {product.offertype === "Flat offer"
                                    ? `₹${product.offer} Flatoffer`
                                    : `${product.offer}% Off`}
                                </p>
                              )}
                            </td>

                            {/* Quantity - Left aligned */}
                            <td className="p-2 text-left text-gray-500  md:text-base xsm:text-sm ">
                              Qty {p.count}
                            </td>

                            {/* Price and Offer */}
                            <td className="p-2 text-right">
                              <p
                                className={`${
                                  product.offer > 0
                                    ? "line-through  md:text-sm xsm:text-xs "
                                    : " md:text-base xsm:text-sm "
                                }`}
                              >
                                ₹{(product.price * p.count).toFixed(2)}
                              </p>
                              {product.offer > 0 && (
                                <div className="font-semibold  md:text-base xsm:text-sm  text-green-800 mt-1">
                                  ₹
                                  {product.offertype === "Flat offer"
                                    ? (product.price - product.offer) * p.count
                                    : (
                                        product.price * p.count -
                                        ((product.price * product.offer) /
                                          100) *
                                          p.count
                                      ).toFixed(2)}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="break-words">
                    Add some products to your cart
                  </div>
                )}
              </div>
            ) : (
              <div></div>
            )}

            {/* Summary Section */}
            <div className="max-h-max w-full lg:w-full lg:col-start-3 lg:col-span-1 ">
              {coupons.length > 0 && (
                <div
                  onClick={() => {
                    setCouponPopup(true);
                  }}
                  className="h-16 mt-4 mb-8 ml-auto cursor-pointer hover:shadow-md lg:w-[90%] xsm:w-full border-2 border-gray-300 rounded flex items-center"
                >
                  <BiSolidOffer className="h-[75%] w-[25%]  text-green-800" />
                  <div className="w-[60%]">
                    <div className="md:text-base xsm:text-xs">
                      {coupon
                        ? Object.entries(coupon)[0][0].toUpperCase()
                        : "Apply Coupon"}
                    </div>
                    {coupons.length > 1 && (
                      <div className="text-sm underline flex items-center">
                        {coupons.length} coupons available{" "}
                        <MdOutlineKeyboardArrowRight />
                      </div>
                    )}
                  </div>
                  {coupon && (
                    <div className="w-[20%]">
                      <button
                        className={`md:text-base xsm:text-xs font-semibold text-red-500 `}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCoupon();
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="max-h-max max-w-max shadow-md rounded ml-auto lg:mt-8">
                <div className="w-full p-4 h-12 flex gap-20 items-center justify-between">
                  <p className="md:text-base xsm:text-sm ">
                    Price({orderSummary.length}{" "}
                    {orderSummary.length > 1 ? " items" : " item"})
                  </p>
                  <p className="md:text-base xsm:text-sm ">
                    {" "}
                    ₹ {total.toFixed(2)} /-
                  </p>
                </div>
                <div className="w-full p-4 h-12 flex gap-4 items-center justify-between">
                  <p className="md:text-base xsm:text-sm ">Delivery Charge</p>
                  <p className="md:text-base xsm:text-sm "> free</p>
                </div>
                {discount > 0 ? (
                  <div className="w-full p-4 h-12 flex gap-4 items-center justify-between">
                    <p className="md:text-base xsm:text-sm ">Discount</p>
                    <p className="md:text-base xsm:text-sm ">
                      ₹ {discount?.toFixed(2)} /-
                    </p>
                  </div>
                ) : (
                  ""
                )}
                <div className="w-full p-4 h-12 flex gap-4 items-center justify-between">
                  <p className="font-bold md:text-lg xsm:text-xl">Total</p>
                  <div>
                    <p
                      className={`font-bold  flex justify-end ${
                        coupon && "line-through xsm:text-sm md:text-base"
                      }`}
                    >
                      {" "}
                      ₹ {subTotal?.toFixed(2)} /-
                    </p>
                    {coupon && (
                      <p className="font-bold md:text-lg xsm:text-xl">
                        {" "}
                        ₹{" "}
                        {(
                          subTotal -
                          (subTotal * Object.values(coupon)[0]) / 100
                        ).toFixed(2)}{" "}
                        /-
                      </p>
                    )}
                  </div>
                </div>
                {isOrderSummary ? "" : <hr />}
              </div>
              <div className="w-full h-24 mt-4 flex justify-end items-center">
                <button
                  className="max-w-max aspect-[4/1] border-2 border-gray-300 bg-orange-500 rounded text-white p-4"
                  onClick={handleexit}
                >
                  Continue to pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderPage;
