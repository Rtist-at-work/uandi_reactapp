import React, { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IoHeart } from "react-icons/io5";
import Footer from "./Footer";
import axios from "axios";
import { FaStar } from "react-icons/fa6";
import { FaRegSadCry } from "react-icons/fa";
import Header from "./Header";

const ProductPage = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [isOpen, setIsOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [faq, setFaq] = useState(false);
  const [styleList, setStyleList] = useState([]);
  const [posters, setPosters] = useState(null);
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState();
  const [stylenav, setStyleNav] = useState("");
  const [categorynav, setCategoryNav] = useState("");
  const [priceFrom, setPriceFrom] = useState(null);
  const [priceTo, setPriceTo] = useState(null);
  const [color, setColor] = useState(null);
  const [filterColor, setFilterColor] = useState([]);
  const [size, setSize] = useState([]);
  const [whishlist, setWhishlist] = useState([]);
  const [recall, setRecall] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    // const cn = queryParams.get("categorynav");
    setCategoryNav(queryParams.get("categorynav"));
    setStyleNav(queryParams.get("stylenav"));
    const filterSize = queryParams.get("size");
    if (filterSize) {
      setSize((prev) => [...prev, filterSize]);
    }
  }, [location.search]); // Only run once when the component mounts

  useEffect(() => {
    const getproducts = async () => {
      try {
        const response = await axios.get(
          `${URI}/productList/?categorynav=${categorynav}&stylenav=${stylenav}`
        );
        if (response.status === 200 || response.status === 201) {
          setProductList(response.data.products);
          // setColor(()=>response.data.products.map((p)=>p.images.map((img)=>img)))
          const ff = response.data.products.flatMap((p) => p.images);
          console.log(ff);
          const uniqueArray = ff
            .filter((prd) => prd !== undefined) // Remove undefined entries
            .reduce((map, prd) => {
              const key = prd?.[1]?.[0]?.colorname || ""; // Use `colorname` as a key
              if (key && !map.has(key)) {
                map.set(key, prd);
              }
              return map;
            }, new Map()) // Accumulate unique objects based on `colorname`
            .values(); // Extract values from the map

          // Convert MapIterator to an array
          const resultArray = Array.from(uniqueArray);
          setColor(resultArray); // Set the unique array
        }
      } catch (err) {
        console.log(err);
      }
    };
    const getCategory = async () => {
      try {
        const response = await axios.get(
          `${URI}/category/?categorynav=${categorynav}`
        );
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data.category);
          // Assuming response is the response object from your API call
          if (
            response.data &&
            response.data.styleList &&
            response.data.styleList.length > 0
          ) {
            setStyleList(response.data.styleList[0].style); // Accessing the style from the first element in styleList
            setPosters(response.data.styleList[0].posters); // Accessing the posters from the first element in styleList
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getproducts();
    getCategory();
  }, [categorynav && stylenav]);

  const handleWhishlist = async (productDetails) => {
    const product = { productId: productDetails.id };
    try {
      const response = await axios.post(`${URI}/auth/whishlist`, product);
      if (response.status === 200 || response.status === 201) {
        // alert("product successfully added to wishlist");
        setRecall(!recall);
      } else if (response.status(400)) alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate(
          `/login/?categorynav=${productDetails.category}&stylenav=${productDetails.style}&pagetype=productpage`
        );
      } else if (error.response && error.response.status === 404) {
        console.log(error)
        alert(error.response.data.message);
        navigate(
          `/login/?categorynav=${productDetails.category}&stylenav=${productDetails.style}&pagetype=productpage`
        );
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };
  useEffect(() => {
    const getwhishlist = async () => {
      try {
        const response = await axios.get(`${URI}/auth/getWhishlist`);
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setWhishlist(
            () =>
              response.data.products
                ? response.data.products
                    .filter((w) => w.id) // Filter items that have a productId
                    .map((w) => w.id)
                : [] // Extract only the productId
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    getwhishlist();
  }, [recall]);

  const handleStyleNav = (c, s) => {
    setStyleNav(s);
    setCategoryNav(c);
    navigate(`/productpage?categorynav=${c}&stylenav=${s}`);
  };

  const toggleAnswer = (e) => {
    const id = e.target.id;
    if (id === "price") setIsPriceOpen(!isPriceOpen);
    else if (id === "color") setIsColorOpen(!isColorOpen);
    else if (id === "size") setIsSizeOpen(!isSizeOpen);
    else if (id === "filter") setIsOpen(!isOpen);
    else if (id === "faq") setFaq(!faq);
  };

  return (
    <div className="h-screen w-screen relative ">
      <Header />
      <div className="h-[5%] w-full flex justify-start items-center">
        <Link to="/">
          <div className="px-4 py-2 lg:text-xl">Home</div>
        </Link>
        <div className=" overflow-y-none flex scrollbar-hidden">
          {categoryList && categoryList.length > 0 ? (
            categoryList.map((category) =>
              category.category === categorynav ? null : ( // Use `null` instead of an empty string
                <div key={category.category} className="relative group ml-4">
                  <a className="cursor-pointer lg:text-xl text-gray-600">
                    {category.category}
                  </a>
                  <ul className="absolute left-0 hidden group-hover:block bg-white border gap-4 z-[999] min-w-max rounded">
                    {category.style.length > 0 ? (
                      category.style.map((style, index) => (
                        <li
                          key={style.style}
                          className="px-4 py-2 cursor-pointer"
                          onClick={() => {
                            handleStyleNav(category.category, style.style);
                          }}
                        >
                          {style.style}
                        </li>
                      ))
                    ) : (
                      <div>Styles not found</div>
                    )}
                  </ul>
                </div>
              )
            )
          ) : (
            <div>No data</div>
          )}
        </div>
      </div>
      <main className=" h-[80%] w-full  overflow-y-auto scrollbar-hidden ">
        <div className="aspect-[16/9] bg-red-200">
          {posters && (
            <img
              src={`data:image/png;base64,${posters[0]}`}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="  h-[10%] w-full flex z-10">
          <div
            className="h-full w-[20%] flex items-center bg-gray-100 justify-center  z-10"
            onClick={(e) => {
              toggleAnswer(e);
            }}
          >
            <h1 id="filter">Filter</h1>
          </div>
          <div className="h-full w-[80%]  bg-green-100 flex items-center justify-start overflow-x-auto  scrollbar-hidden scroll px-4">
            <ul className="flex space-x-8 cursor-pointer xsm:text-sm">
              <li className="font-semibold min-w-max text-teal-900 lg:text-xl">
                {categorynav}
              </li>
              <li className=" min-w-max border-b-2 border-teal-900 lg:text-xl">
                {stylenav}
              </li>
              {styleList.length > 0
                ? styleList.map((s, index) => {
                    return (
                      <li
                        key={index}
                        className={` min-w-max ${
                          stylenav === s.style ? "hidden" : ""
                        } lg:text-xl`}
                        onClick={() => {
                          handleStyleNav(categorynav, s.style);
                        }}
                      >
                        {s.style}
                      </li>
                    );
                  })
                : console.log("nok")}
            </ul>
          </div>
        </div>

        <div className="relative min-h-max flex w-full  flex  justify-start ">
          <div
            className={`max-h-max w-[20%] md:block ${
              isOpen
                ? "xsm:absolute xsm:w-[80%] md:relative md:w-[20%]  xsm:block"
                : "xsm:hidden"
            } text-gray-600 bg-gray-100 p-4 z-10`}
          >
            <div className=" p-4 flex flex-col space-y-6">
              <div
                id="price"
                className="w-full flex justify-between items-center"
                onClick={(e) => {
                  toggleAnswer(e);
                }}
              >
                <p>Price</p>
                <IoChevronDown
                  id="price"
                  className=""
                  onClick={(e) => {
                    toggleAnswer(e);
                  }}
                />
              </div>
              {isPriceOpen && (
                <div className="flex gap-4 mt-[10%]">
                  <input
                    id="pricefrom"
                    type="number"
                    className="w-[50%]"
                    onChange={(e) => {
                      setPriceFrom(e.target.value);
                    }}
                  ></input>
                  to
                  <input
                    id="priceto"
                    type="number"
                    className="w-[50%]"
                    onChange={(e) => {
                      if (e.target.value) setPriceTo(e.target.value);
                      else setPriceTo(null);
                    }}
                  ></input>
                </div>
              )}
              <hr></hr>
              <div
                id="size"
                className="w-full flex justify-between items-center"
                onClick={(e) => {
                  toggleAnswer(e);
                }}
              >
                <p>Size</p>
                <IoChevronDown
                  id="size"
                  className=""
                  onClick={(e) => {
                    toggleAnswer(e);
                  }}
                />
              </div>
              <div className=" flex gap-2 flex-wrap max-h-max w-full py-4">
                {isSizeOpen &&
                  styleList.map((st) => {
                    return (
                      st.style === stylenav &&
                      st.sizes.map((sty, index) => (
                        <div
                          className={`border-2 border-gray-300 max-h-max max-w-max py-2 px-4 ${
                            size.includes(sty) ? "bg-red-400 text-white" : ""
                          } rounded md:text-base xsm:text-xs flex flex-wrap cursor-pointer `}
                          onClick={() => {
                            size.includes(sty)
                              ? setSize(() => size.filter((s) => s !== sty))
                              : setSize((prev) => [...prev, sty]);
                          }}
                        >
                          {sty}
                        </div>
                      ))
                    );
                  })}
              </div>
              <hr></hr>
              <div
                id="color"
                className="w-full flex justify-between items-center"
                onClick={(e) => {
                  toggleAnswer(e);
                }}
              >
                <p>Color</p>
                <IoChevronDown
                  id="color"
                  className=""
                  onClick={(e) => {
                    toggleAnswer(e);
                  }}
                />
              </div>
              {isColorOpen && (
                <div className="flex flex-wrap gap-2">
                  {color?.length > 0
                    ? color.map((color, index) => (
                        <img
                          key={index}
                          onClick={() =>
                            filterColor.includes(color[1][0].colorname)
                              ? setFilterColor(() =>
                                  filterColor.filter(
                                    (s) => s !== color[1][0].colorname
                                  )
                                )
                              : setFilterColor((prev) => [
                                  ...prev,
                                  color[1][0].colorname,
                                ])
                          }
                          src={color[1][0].colorImage}
                          className={`h-12 w-12 object-cover rounded border-4 cursor-pointer ${
                            filterColor.includes(color[1][0].colorname)
                              ? "border-blue-500 "
                              : "border-white"
                          }`}
                          alt="Color Image"
                        />
                      ))
                    : "colors not available"}
                </div>
              )}
            </div>
            <hr></hr>
          </div>
          <div className="relative min-h-max md:w-[80%] xsm:w-full grid grid-cols-2 lg:grid-cols-4 gap-4 p-2">
            {productList.length > 0
              ? productList.map((product, index) => {
                  if (
                    ((priceFrom === null ||
                      (product.offer > 0
                        ? product.offertype === "Flat offer"
                          ? product.price - product.offer
                          : product.price -
                              (product.price / 100) * product.offer >
                            priceFrom
                        : product.price > priceFrom)) &&
                      (priceTo === null ||
                        (product.offer > 0
                          ? product.offertype === "Flat offer"
                            ? product.price - product.offer
                            : product.price -
                                (product.price / 100) * product.offer <
                              priceTo
                          : product.price < priceTo)) &&
                      (size.length === 0 ||
                        size.some((s) => product.sizes.includes(s))) &&
                      filterColor.length === 0) ||
                    product.images.some((image) =>
                      filterColor.some((c) => image[1]?.[0]?.colorname === c)
                    )
                  ) {
                    return (
                      <div
                        key={index}
                        className="relative overflow-hidden p-1 cursor-pointer hover:shadow-xl rounded z-0 w-full transition-transform duration-300 ease-in-out"
                        onClick={() => {
                          product.stock === "In Stock" &&
                            navigate(`/productDetails?id=${product.id}`);
                        }}
                      >
                        <div className="w-full h-full">
                          {product && product.stock === "Out Of Stock" ? (
                            <div className="absolute top-2 right-2 px-2 py-1 max-w-max bg-red-600 gap-2 xsm:text-xs md:text-base text-white flex items-center gap-1 rounded">
                              {product.stock}
                            </div>
                          ) : product.offer > 0 ? (
                            <div className="absolute top-2 right-2 bg-green-100 xsm:text-xs md:text-base text-gray-600 font-semibold max-w-max max-h-max p-2 rounded">
                              {product.offertype === "Flat offer"
                                ? `₹${product.offer} Flatoffer`
                                : `sale ${product.offer}%`}
                            </div>
                          ) : null}

                          <div
                            className={`absolute top-2 left-2  px-2 py-1 max-w-max  gap-2 xsm:text-xs md:text-base text-white flex items-center gap-1 rounded `}
                          >
                            <IoHeart
                              id="index"
                              className={`text-3xl ${
                                whishlist.includes(product.id)
                                  ? "text-red-500"
                                  : "text-white"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWhishlist(product);
                              }}
                            />
                          </div>

                          {product.images.length > 0 ? (
                            <img
                              src={product.images[0][0][0]}
                              className="object-cover w-full aspect-[1/1] rounded border-2 border-gray-300"
                              alt={`product-${index}`}
                            />
                          ) : (
                            <div className="h-[200px] w-full break-words flex items-center justify-center bg-gray-100">
                              No Images Found
                            </div>
                          )}

                          <div className="flex-grow min-h-24 flex flex-col gap-2 px-2 mt-4">
                            <p className="xsm:text-xsm md:text-base text-gray-500 font-semibold hover:text-blue-500">
                              {product && product.name.length > 30
                                ? `${product.name.slice(0, 30)}...`
                                : product
                                ? product.name
                                : "Unknown"}
                            </p>
                            <div className="flex gap-2 items-center">
                              {product && (
                                <>
                                  {product.offer > 0 && (
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
                  } 
                  // else{
                  //   return (<div
                  //     key={index}
                  //     className="absolute overflow-hidden p-1 cursor-pointer hover:shadow-xl h-full rounded z-0 w-full transition-transform duration-300 ease-in-out justify-center items-center flex flex-col font-semibold text-lg"

                  //   >
                  //     <FaRegSadCry className="text-7xl text-yellow-400"/>
                  //     Products not available please try again later
                  //   </div>)
                  // }                 
                })
              : ""}
          </div>
        </div>
        
        <Footer />
      </main>
    </div>
  );
};

export default ProductPage;
