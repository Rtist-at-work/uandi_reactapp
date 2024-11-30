import { FaStar } from "react-icons/fa6";

import React, { useEffect, useState } from "react";
import Footer from "./mobile components/Footer";
import { MdEditSquare } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductPage = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [filteredProduct, setFilteredProduct] = useState([]);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const stylenav = queryParams.get("stylenav");
    const categorynav = queryParams.get("categorynav");
    const getproducts = async () => {
      try {
        const response = await axios.get(
          `${URI}/productList/?categorynav=${categorynav}&stylenav=${stylenav}`
        );
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setFilteredProduct(response.data.products);
        }
      } catch (err) {
        console.log(err);
      }
    };

    getproducts();
  }, []);

  return (
    <div className="absolute h-[90%] w-full bg-white-800 rounded-md shadow-md">
      {/* Conditional Rendering with Null Check */}
      <main className="xsm:h-[95%] md:h-full w-full">
        <h1 className="h-[10%] flex text-lg p-2 items-center">
          {filteredProduct && filteredProduct.length > 0
            ? filteredProduct[0].category
            : "No Category"}
        </h1>

        <div className="h-[90%] w-full overflow-y-auto px-2 py-4 grid grid-cols-2 md:grid-cols-4 gap-2 cursor-pointer hover:shadow-inner scrollbar-hidden">
          {filteredProduct && filteredProduct.length > 0 ? (
            filteredProduct.map((product, index) => {
              return (
                <div
                  key={index}
                  className="relative w-full max-h-max shadow-md shrink-0 rounded bg-white shadow-sm p-2 border-2 border-gray-300"
                >
                  <div className="w-full">
                    <MdEditSquare
                      id={product.id}
                      className="absolute right-0 top-0 h-8 w-[15%] bg-white text-gray-500 cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/editproducts/?id=${product.id}`);
                      }}
                    />
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0][0][0]}
                        className="w-full aspect-[1/1] object-cover rounded"
                        alt={`product-${index}`}
                      />
                    ) : (
                      <div className="h-[150px] w-full flex items-center justify-center">
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
                      <div className="flex flex-wrap gap-2 items-center">
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
                              <p className="text-sm text-green-700 font-semibold">
                                {product.offer}% Off
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      {product && product.review.stars ? (
                        <div className="px-2 py-1 max-w-max bg-green-700 gap-2 flex items-center gap-1 rounded">
                          <p className="font-semibold text-sm text-white">
                            {product.review.stars}
                          </p>
                          <FaStar className="xsm:h-3 xsm:w-3 md:h-2 xsm:w-2 text-white" />
                        </div>
                      ) : (
                        <div className="text-gray-500 md:text-base xsm:text-xs">
                          no reviews
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full w-full flex items-center justify-center text-lg">
              No Products Found
            </div>
          )}
        </div>
      </main>

      <div className="absolute h-[5%] w-full md:hidden xsm:block flex items-center justify-center bottom-0 bg-gray-300">
        <Footer />
      </div>
    </div>
  );
};
//mmvml

export default ProductPage;
