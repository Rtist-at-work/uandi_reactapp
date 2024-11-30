import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const Cart = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [cartProducts, setCartProducts] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [login, setLogin] = useState(true);
  const navigate = useNavigate();

  // Function to calculate subtotal
  const calculateSubtotal = (cartProducts) => {
    let subtotal = 0;
    let discount = 0;
    cartProducts.forEach((cartProduct) => {
      const price = cartProduct.product.price;
      if (cartProduct.product.offertype === "Flat offer") {
        discount = discount + cartProduct.product.offer * cartProduct.count;
      } else {
        discount =
          discount +
          (cartProduct.product.price / 100) *
            cartProduct.product.offer *
            cartProduct.count;
      }
      subtotal += price * cartProduct.count;
    });
    console.log(discount)
    console.log(subtotal)
    console.log(subtotal-discount)
    setDiscount(discount);
    setSubTotal(subtotal);
  };
  // Fetch cart products and product list on initial render
  useEffect(() => {
    const getProductsAndCart = async () => {
      try {
        // Fetch the cart
        const cartResponse = await axios.get(`${URI}/auth/getCart`);
        if (cartResponse.status === 200 || cartResponse.status === 201) {
          setCartProducts(cartResponse.data.cart);
          setLogin(true);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            // Check the response status in the error object
            setLogin(false);
          }
        } else {
          console.error("An unexpected error occurred:", err);
        }
      }
    };

    getProductsAndCart();
  }, []);

  // Recalculate subtotal whenever cartProducts or productList changes
  useEffect(() => {
    if (cartProducts.length > 0) {
      calculateSubtotal(cartProducts);
    }
  }, [cartProducts]);
  // Update cart product count
  const countop = async (e, index, count, productId) => {
    const id = e.target.id;
    const updatedCartProducts = [...cartProducts];
    let editedCount = count;

    if (id === "plus") {
      editedCount += 1;
    } else if (id === "minus" && count > 1) {
      editedCount -= 1;
    } else {
      // Avoid unnecessary API calls if count is not modified
      return;
    }

    updatedCartProducts[index].count = editedCount;

    try {
      const response = await axios.put(
        `${URI}/auth/editCartProduct/${productId}/${editedCount}`
      );

      if (response.status === 200) {
        setCartProducts(updatedCartProducts); // Update state only on successful response
      }
    } catch (err) {
      console.error("Error updating cart product:", err);
    }
  };

  // Delete item from cart
  const deleteCartItem = async (index) => {
    console.log("ppp")
    try {
      const productId = cartProducts[index]._id;     
      const response = await axios.put(
        `${URI}/auth/deleteCartProduct/${productId}`
      );
      if(response.status===200||response.status===201){
        const updatedCart = [...cartProducts];
        updatedCart.splice(index, 1);
        setCartProducts(updatedCart);
      }
    } catch (err) {
      alert("something went wrong please try again later")
      console.error(err);
    }
  };
console.log(cartProducts)
  // Navigate to order page
  const handleOrder = () => {
    navigate("/orderpage");
  };
  console.log(cartProducts);
  return (
    <div className="h-screen w-screen overflow-auto scrollbar-hidden">
      <Header />
      <main className="relative h-[85%]  w-full md:grid md:grid-cols-3">
        <div className="max-h-max md:col-start-1 md:col-span-2">
          <h1 className="p-4">YOUR CART</h1>
          {login ? (
            cartProducts?.length > 0 ? (
              <table className="max-h-max w-full">
                <thead>
                  <tr className="bg-gray-200 w-full">
                    <th className="p-2 w-[40%]">Product</th>
                    <th className="p-2 w-[15%] xsm:hidden xxsm:table-cell ">
                      Size
                    </th>
                    <th className="p-2 w-[10%] xsm:hidden xxsm:table-cell ">
                      Quantity
                    </th>
                    <th className="p-2  w-[20%] ">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((filteredProduct, index) => {

                    if (!filteredProduct) return null;

                    return (
                      <tr key={filteredProduct.id} className="border-b">
                        <td className="p-2 flex items-center gap-4 w-full ">
                          {filteredProduct.product.images &&
                          filteredProduct.product.images.length > 0 ? (
                            filteredProduct.product.images.map(
                              (image, index) => {
                                if (
                                  image[1][0].colorname ===
                                  filteredProduct.selectedColor
                                ) {
                                  return (
                                    <img
                                      key={index}
                                      src={
                                        image[1][0].colorname ===
                                          filteredProduct.selectedColor &&
                                        image[0][0]
                                      }
                                      alt="product"
                                      className="h-20 w-20 border-2 border-gray-300 shadow-md rounded"
                                    />
                                  );
                                }
                              }
                            )
                          ) : (
                            <div>No Image</div>
                          )}

                          <div className="flex flex-col gap-2 ">
                            {/* Product Name */}
                            <h1 className="font-thin md:text-base xsm:text-sm ">
                              {filteredProduct.product.name}
                            </h1>

                            {/* Product Color */}
                            <p className="text-sm text-gray-600">
                              Color:{" "}
                              {filteredProduct.selectedColor.length > 10
                                ? `${filteredProduct.selectedColor.slice(
                                    0,
                                    10
                                  )}...`
                                : filteredProduct.selectedColor}
                            </p>

                            {/* Quantity Controls (Visible above xxsm, hidden below) */}
                            <div className="flex items-center gap-4 xxsm:hidden">
                              <button
                                id="minus"
                                className="md:h-6 md:w-6 xsm:h-4 xsm:w-4 xsm:text-xs md:text-base  flex items-center justify-center bg-red-300 md:rounded"
                                onClick={(e) => {
                                  countop(
                                    e,
                                    index,
                                    filteredProduct.count,
                                    filteredProduct.product.id
                                  );
                                }}
                              >
                                -
                              </button>
                              <div className="text-sm font-medium">
                                {filteredProduct.count}
                              </div>
                              <button
                                id="plus"
                                className="md:h-6 md:w-6 xsm:h-4 xsm:w-4 xsm:text-xs md:text-base flex items-center justify-center bg-red-300 md:rounded"
                                onClick={(e) => {
                                  countop(
                                    e,
                                    index,
                                    filteredProduct.count,
                                    filteredProduct.product.id
                                  );
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Product Size (Visible above xxsm, hidden below) */}
                            <p className="text-sm text-gray-600 xxsm:hidden">
                              Size: {filteredProduct.selectedSize}
                            </p>
                          </div>
                        </td>

                        {/* Size */}
                        <td className="p-2 text-center xxsm:table-cell xsm:hidden ">
                          {filteredProduct.selectedSize}
                        </td>

                        {/* Quantity */}
                        <td className="p-2 xsm:hidden xxsm:table-cell ">
                          <div className="flex items-center justify-between">
                            <button
                              id="minus"
                              className="h-6 w-6 flex items-center justify-center bg-red-300"
                              onClick={(e) => {
                                countop(
                                  e,
                                  index,
                                  filteredProduct.count,
                                  filteredProduct.product.id
                                );
                              }}
                            >
                              -
                            </button>
                            <div>{filteredProduct.count}</div>
                            <button
                              id="plus"
                              className="h-6 w-6 flex items-center justify-center bg-red-300"
                              onClick={(e) => {
                                countop(
                                  e,
                                  index,
                                  filteredProduct.count,
                                  filteredProduct.product.id
                                );
                              }}
                            >
                              +
                            </button>
                          </div>
                          <div
                            className="mt-4 w-full xsm:hidden md:block underline cursor-pointer"
                            onClick={() => deleteCartItem(index)}
                            style={{ textDecorationColor: "red" }}
                          >
                            <p className="text-base text-red-500">remove</p>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="relative p-2 text-center ">
                          <div
                            className="absolute top-2 right-4 md:hidden underline cursor-pointer"
                            onClick={() => deleteCartItem(index)}
                            style={{ textDecorationColor: "red" }}
                          >
                            <p className="text-xs text-red-500">remove</p>
                          </div>
                          <div className="flex flex-col">
                            <p
                              className={`${
                                filteredProduct.product.offer > 0
                                  ? "line-through md:text-sm xsm:text-xs"
                                  : "md:text-base xsm:text-sm"
                              }`}
                            >
                              ₹ {filteredProduct.product.price*(filteredProduct.count)} /-
                            </p>
                            {filteredProduct.product.offer > 0 && (
                              <p className="text-green-800  md:text-base xsm:text-sm">
                                {`₹${(filteredProduct.product.offertype ===
                                "Flat offer"
                                  ? filteredProduct.product.price -
                                    filteredProduct.product.offer
                                  : (filteredProduct.product.price -(filteredProduct.product.price / 100) *
                                    filteredProduct.product.offer
                                ))*(filteredProduct.count).toFixed(2)} /-`}
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="absolute h-full w-full flex items-center justify-center">
                <button
                  onClick={() => {
                    navigate("/");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 mx-auto text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Add Products
                </button>
              </div>
            )
          ) : (
            <div className="absolute h-full w-full flex items-center justify-center">
              <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  No cart products found
                </h2>
                <p className="text-gray-600 mb-6">
                  Please login to view cart products.
                </p>
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
        {login && cartProducts.length > 0 && (
          <div className="md:relative md:col-start-3 md:col-span-1 md:h-full md:w-full py-16 md:flex md:flex-col p-2 md:items-center md:justify-start ">
            <div className="max-h-max max-w-max md:mx-auto  p-2 rounded-md bg-white ml-auto shadow-md mb-8">
              <div className="w-full p-4 h-12 flex gap-16 items-center justify-between">
                <p className="md:text-base xsm:text-sm ">
                  Price ({cartProducts.length}{" "}
                  {cartProducts?.length > 1 ? " items" : " item"})
                </p>
                <p className="md:text-base xsm:text-sm ">
                  {" "}
                  ₹ {subTotal.toFixed(2)} /-
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
                    ₹ {discount.toFixed(2)} /-
                  </p>
                </div>
              ) : (
                ""
              )}
              <div className="w-full p-4 h-12 flex gap-4 items-center justify-between">
                <p className="font-bold md:text-lg xsm:text-xl ">Total</p>
                <p className="font-bold md:text-lg xsm:text-xl">
                  {" "}
                  ₹ {(subTotal - discount).toFixed(2)} /-
                </p>
              </div>
            </div>
            <div className="md:absolute md:bottom-16 w-full flex justify-center col-start-3 col-span-1 mt-4 mb-8">
              <button
                className="w-[90%] h-12 border-2 border-gray-400 bg-gray-400 lg:mx-auto"
                onClick={handleOrder}
              >
                CHECK OUT
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
