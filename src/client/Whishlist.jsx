import React, { useState, useEffect } from "react";
import Footer from "../components/mobile components/Footer";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { FaStar } from "react-icons/fa6";

const Whishlist = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [whishlist, setWhishlist] = useState([]);
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // const getproducts = async () => {
    //   try {
    //     const response = await axios.get(URI + "/productList");
    //     if (response.status === 200 || response.status === 201) {
    //       setProductList(response.data);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    // getproducts();

    const getwhishlist = async () => {
      try {
        const response = await axios.get(`${URI}/auth/getWhishlist`);
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setWhishlist(response.data.products);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getwhishlist();
  }, []);

  const deletewhishlist = (index) => {
    console.log(index);
    const updatedwhishlist = [...whishlist];
    updatedwhishlist.splice(index, 1);
    setWhishlist(updatedwhishlist);
    const deletewhishlistProduct = async () => {
      try {
        const productId = whishlist[index].productId;
        const response = await axios.put(
          `${URI}/auth/deletewhishlist/${productId}`
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    deletewhishlistProduct();
  };
  return (
    <div className="relative h-screen w-screen">
      <Header />
      <div className="max-h-max w-full p-4 ">
        <h1 className="h-[10%] md:text-xl xsm:text-base font-bold p-2  text-gray-800 mb-4 ">
          MY WISHLIST
        </h1>

        {whishlist && whishlist.length > 0 ? (
          whishlist.map((product, index) => {
            
            return (
              <div
                key={index}
                className="relative flex items-center justify-between xxsm:w-[90%] cursor-pointer md:w-[80%] mx-auto shadow-md p-2 mb-8 rounded"
                onClick={() => {
                  navigate(`/productDetails?id=${product.id}`);
                }}
              >
                {product && product.images ? (
                  <img
                    src={product.images[0][0][0]}
                    className="sm:w-32 xsm:w-24 xsm:h-24 sm:h-32 xsm:w-24 xsm:h-24 aspect-square object-cover mr-4" // Thumbnail size
                    alt={`product-${index}`}
                  />
                ) : (
                  <div className="sm:w-32 xsm:w-24 xsm:h-24 sm:h-32 xsm:w-24 xsm:h-24 aspect-square flex items-center justify-center bg-gray-200 mr-4">
                    No Images Found
                  </div>
                )}
                <div className="flex-grow min-h-24 flex flexwrap flex-col gap-2  ">
                  <p className="xsm:text-xsm md:text-base  font-semibold">
                    {product && product.name.length > 30
                      ? `${product.name.slice(0, 30)}...`
                      : product
                      ? product.name
                      : "Unknown"}
                  </p>
                  <div className="flex gap-2 items-center">
                    {product && (
                      <>
                        {product && product.offer > 0 && (
                          <p className="text-base font-semibold">
                            {`₹${(product.offertype === "Flat offer"
                              ? product.price - product.offer
                              : product.price -
                                (product.price / 100) * product.offer
                            ).toFixed(2)}/-`}
                          </p>
                        )}
                        <p
                          className={`${
                            product.offer > 0
                              ? "line-through text-sm text-gray-500"
                              : "text-base font-semibold"
                          }`}
                        >
                          {product.price
                            ? `₹${product.price}/-`
                            : "Price Unavailable"}
                        </p>
                        {product.offer > 0 && (
                    <div className=" text-green-700 font-semibold max-w-max max-h-max p-1 rounded">
                      {" "}
                      {product.offertype === "Flat offer"
                        ? `₹${product.offer} Flatoffer`
                        : `${product.offer}% Off`}
                    </div>
                  )}
                      </>
                    )}
                  </div>
                </div>
                <MdDelete
                  id={product ? product.id : null}
                  className="absolute top-2 right-2 h-6 w-4 bg-white text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletewhishlist(index);
                  }}
                />
              </div>
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center text-lg">
            No Products Found
          </div>
        )}
      </div>
    </div>
  );
};

export default Whishlist;
