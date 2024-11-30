import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useRef } from "react";

const Homepage = ({ handleCart }) => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [categoryList, setCategoryList] = useState();
  const [banner, setBanner] = useState([]); // fetched banners
  const [ageBanner, setAgeBanner] = useState([]);
  const [age, setAge] = useState([]);
  const [mainBanner, setMainBanner] = useState([]);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [serverImages, setServerImages] = useState([]);
  const [catBanner, setCatBanner] = useState([]);
  const [catIndex, setCatIndex] = useState(0);
  const [bestSellers, setBestSellers] = useState([]);
  const [sizeNavigation, setSizeNavigation] = useState([]);
  const interval = 3000;
  const containerRef = useRef(null);

  // Fetch posters from server
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSlideshowIndex((prevIndex) => (prevIndex + 1) % serverImages.length);

      setCurrentSlide((prevIndex) => (prevIndex + 2) % mainBanner.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, mainBanner.length, serverImages.length]);
  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        console.log(response)
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data.category);
          setCatBanner(response.data.catProducts);
          setSizeNavigation([response.data.categoryData]);
          setBestSellers(response.data.bestsellers);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCategory();
    const bannerFetch = async () => {
      try {
        const response = await axios.get(`${URI}/banners/fetchage`);
        if (response.status === 200 || response.status === 201) {
          console.log(response)
          let arr = [];
          setAge(() =>
            Object.entries(response.data.agebanner)
              ?.map((p) => p[1].age)
              .filter((p) => p != undefined)
              .flat()
          );
          setBanner(response.data.agebanner.imagesData);

          setAgeBanner(response.data.agebanner.imagesData.slice(0, 5));

          setMainBanner(response.data.mainbanner.imagesData);
          const posters = response.data.poster.imagesData;

          setServerImages(posters);
        }
      } catch (err) {
        console.log(err);
      }
    };
    bannerFetch();
  }, []);
  const handleStyleNav = (c, s) => {
    navigate(`/productpage?categorynav=${c}&stylenav=${s}`);
  };
  console.log(catBanner)
  return (
    <div className="h-screen w-screen">
      <Header />

      <main className="relative h-[85%] w-full overflow-y-auto overflow-x-hidden scrollbar-hidden">
        <div className="h-6 lg:h-12 w-full flex bg-white shadow-md gap-4 px-4 justify-around items-center z-10">
          {categoryList && categoryList.length > 0 ? (
            categoryList.map((category) => (
              <div key={category.category} className="relative group z-30">
                <a className="cursor-pointer font-semibold text-customRed">
                  {(category.category).toUpperCase()}
                </a>
                <ul className="absolute left-0 hidden group-hover:block bg-white border z-50 min-w-max transition duration-3000 ease-out hover:ease-in rounded shadow-lg">
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
            ))
          ) : (
            <div>No data</div>
          )}
        </div>
        {/* div1 */}
        <div className="w-full flex p-2 aspect-[4/2]  overflow-auto w-full">
          <div className="relative h-full aspect-[1/1] overflow-y-auto">
            <div className="w-[80%] aspect-[1/1]">
              <img
                src={mainBanner[currentSlide]}
                className="w-full h-full object-cover"
                alt={`Banner ${currentSlide + 1} - Image 1`}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[50%] aspect-[1/1] bg-green-300">
              <img
                src={mainBanner[(currentSlide + 1) % mainBanner.length]}
                className="w-full h-full object-cover"
                alt={`Banner ${currentSlide + 2} - Image 2`}
              />
            </div>
          </div>

          <div className="relative w-1/2 h-full p-4 lg:py-32 flex flex-col justify-start items-start bg-white text-customRed lg:space-y-6   ">
            <p className="xxsm:text-base sm:text-6xl font-bold leading-snug">
              Softest Bamboo Clothes for your little one
            </p>
            <button className="flex items-center space-x-1 text-customRed xsm:text-xs lg:text-3xl  font-medium">
              <span>Shop now</span>
              <MdOutlineArrowRightAlt className="text-xl lg:text-3xl" />
            </button>
          </div>
        </div>

        <h1 className="w-full h-12 mx-auto m-4">Shop by Age</h1>
        <div className="w-full aspect-[4/1]  flex items-center   ">
          <FaAngleLeft
            className="left-0 z-50 text-2xl w-[2%] cursor-pointer sm:block xsm:hidden"
            onClick={() => {
              // Find the current start index of ageBanner in the main banner array
              const startIndex = banner.indexOf(ageBanner[0]);

              // If the start index is already 0, don't move further
              if (startIndex === 0) return;

              // Calculate the new start index by subtracting 5 (move left)
              const newStartIndex = startIndex - 5 < 0 ? 0 : startIndex - 5;

              // Slice the banner array to get the new set of 5 banners
              setAgeBanner(banner.slice(newStartIndex, newStartIndex + 5));
            }}
          />

          <div className="relative flex gap-2 items-center sm:overflow-hidden xsm:overflow-auto sm:w-[96%] xsm:w-full h-full ">
            {ageBanner &&
              ageBanner.map((bannerItem, index) => {
                return (
                  <div
                    onClick={() => {
                      sizeNavigation.map((category) => {
                        Object.entries(category).map((cat) => {
                          if (cat[1].sizes.includes(age[index])) {
                            Object.entries(cat[1].styles).map((sty) => {
                              if (sty[1].includes(age[index])) {
                                navigate(
                                  `/productpage?categorynav=${cat[0]}&stylenav=${sty[0]}&size=${age[index]}`
                                );
                              }
                            });
                          }
                        });
                      });
                    }}
                    key={index}
                    className="w-[20%] sm:flex xsm:hidden  flex-col gap-2 items-center justify-center aspect-[1/1]"
                  >
                    <img
                      src={bannerItem}
                      className="w-[70%] aspect-[1/1] rounded-full object-cover"
                      alt={`img-${index}`}
                    />
                    <p className="h-[20%] max-w-max ">
                      {age[index] || "Age not available"}
                    </p>
                  </div>
                );
              })}
            {banner &&
              banner.map((bannerItem, index) => {
                return (
                  <div
                    key={index}
                    className="h-full sm:hidden  shrink-0 xsm:flex flex-col items-center justify-center aspect-[1/1] scrollbar-hidden"
                  >
                    <img
                      src={bannerItem}
                      className="h-[70%] aspect-[1/1] rounded-full object-cover"
                      alt={`img-${index}`}
                    />
                    <p className="h-[20%]">
                      {age[index] || "Age not available"}
                    </p>
                  </div>
                );
              })}
          </div>
          <FaChevronRight
            className="left-0 z-50 text-2xl w-[2%] cursor-pointer sm:block xsm:hidden"
            onClick={() => {
              // Find the current start index of ageBanner in the main banner array
              const startIndex = banner.indexOf(ageBanner[0]);

              // Calculate the new start index by adding 5 (move right)
              const newStartIndex =
                startIndex + 5 >= banner.length ? 0 : startIndex + 5;

              // Slice the banner array to get the new set of 5 banners
              setAgeBanner(banner.slice(newStartIndex, newStartIndex + 5));
            }}
          />
        </div>

        {/* categories */}
        <div className="max-h-max w-full p-2">
          <div className="h-[10%]">
            <h1 className="xsm:text-sm">Explore by categories</h1>
          </div>
          <div className="relative xsm:h-[300px] lg:h-[500px] sm:h-[400px] w-full ">
            {catIndex > 0 && (
              <HiOutlineArrowLeft
                className="absolute md:block xsm:hidden left-2 top-1/2 md:text-3xl z-50 bg-white rounded-full"
                onClick={() => {
                  setCatIndex(() =>
                    catIndex + 4 <= catBanner.length - 1 ? catIndex - 4 : 0
                  );
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      left: 0,
                      behavior: "smooth",
                    });
                  }
                }}
              />
            )}
            {catIndex + 1 < catBanner.length - 1 && (
              <MdOutlineArrowRightAlt
                className="absolute md:block xsm:hidden right-2 top-1/2 md:text-3xl z-50 bg-white rounded-full"
                onClick={() => {
                  setCatIndex(() =>
                    catIndex + 4 <= catBanner.length - 1 ? catIndex + 4 : 0
                  );
                }}
              />
            )}
            <div
              ref={containerRef}
              className="h-full w-full bg-gray-100 flex gap-2 p-2 xsm:overflow-x-auto scrollbar-hidden"
            >
              {catIndex > 0 && (
                <div className="w-[20%] xsm:flex md:hidden h-full  justify-center items-center">
                  <HiOutlineArrowLeft
                    className="xsm:text-3xl z-50 bg-white rounded-full"
                    onClick={() => {
                      setCatIndex(() =>
                        catIndex + 4 <= catBanner.length - 1 ? catIndex - 4 : 0
                      );
                      if (containerRef.current) {
                        containerRef.current.scrollTo({
                          left: 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                </div>
              )}

              {catBanner &&
                catBanner.map((cat, index) => {
                  // For first case: if catIndex is 0 and index < (catIndex + 4)
                  if (index >= catIndex && index < catIndex + 4) {
                    return (
                      <div
                        className="relative h-full md:w-[24%] xsm:w-[50%] bg-red-200 flex-shrink-0 cursor-pointer"
                        onClick={() => {
                          handleStyleNav(cat.category, cat.style);
                        }}
                      >
                        {cat.offer > 0 && (
                          <div className="absolute top-2 right-2 bg-green-100 xsm:text-xs md:text-base text-gray-600 font-semibold max-w-max max-h-max p-2 rounded">
                            {cat.offertype === "Flat offer"
                              ? `₹${cat.offer} Flatoffer`
                              : `sale ${cat.offer}%`}
                          </div>
                        )}
                        <img
                          src={cat.images[0][0][0]}
                          className="w-full h-full"
                        />
                        <div className="absolute flex justify-right backdrop-blur-sm just bottom-0 w-full h-24 p-2 rounded">
                          <p className="xsm:text-xl md:text-3xl text-white font-semibold">
                            {cat.category}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  // Return nothing if the conditions are not met
                  return null;
                })}
              {catIndex + 1 < catBanner.length - 1 && (
                <div className="w-[20%] xsm:flex md:hidden h-full  justify-center items-center">
                  <MdOutlineArrowRightAlt
                    className="xsm:text-3xl z-50 bg-white rounded-full"
                    onClick={() => {
                      setCatIndex(() =>
                        catIndex + 4 <= catBanner.length - 1 ? catIndex + 4 : 0
                      );
                      if (containerRef.current) {
                        containerRef.current.scrollTo({
                          left: 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* posters */}
        <div className="aspect-[16/9] w-full p-2">
          <div className="relative h-full w-full flex justify-center items-center">
            {serverImages.length > 0 ? (
              <img
                src={serverImages[slideshowIndex]}
                className="h-full w-full  object-cover"
                alt="slideshow"
              />
            ) : (
              <p>No images to display</p>
            )}
          </div>
        </div>

        {/* top rated */}
        <h1 className="h-[10%] w-full xsm:text-sm p-2">Top Rated</h1>
        <div className="w-full md:max-h-max overflow-x-auto scrollbar-hidden mt-2 md:col-start-1 flex gap-2  justify-around md:col-span-2 p-4 rounded-md shadow-md">
          {bestSellers &&
            bestSellers.map((product, index) => (
              <div
                className="md:h-96 xsm-h-64  xsm:w-32 md:w-48 bg-gray-100 rounded p-2 flex flex-col flex-shrink-0 "
                onClick={() => {
                  navigate(`/productDetails?id=${product.id}`);
                }}
              >
                <img
                  key={index}
                  src={product.images[0][0][0]}
                  alt="Thumbnail"
                  className="relative w-full aspect-[1/1] rounded-md cursor-pointer border border-gray-300 shadow-md transition-transform duration-300 transform hover:scale-105"
                  onClick={() => {
                    setIndex(index);
                  }}
                />
                <div className="max-h-max w-full flex flex-col gap-1 px-2 mt-2">
                  <p className="line-clamp-1 sm:text-xs md:text-base font-semibold">
                    {product.name}
                  </p>
                  <div className="flex  gap-2">
                    <p className="line-clamp-1 text-xs min-w-max ">
                      {product.sizes[0]}
                    </p>
                    <p className="line-clamp-1 text-xs ">
                      {product?.images[0][1][0]?.colorname}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {product && (
                      <>
                        {product.offer > 0 && (
                          <p className=" sm:text-xs md:text-base font-semibold">
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
                              ? "line-through text-xs text-gray-500"
                              : "sm:text-xs md:text-base font-semibold"
                          }`}
                        >
                          {product.price
                            ? `₹${product.price}/-`
                            : "Price Unavailable"}
                        </p>
                      </>
                    )}
                  </div>
                  {product && product.review?.stars ? (
                    <div className="px-2 py-1 max-w-max bg-green-700 gap-2 flex items-center gap-1 rounded">
                      <p className="font-semibold xsm:text-xs md:text-base text-white">
                        {product.review.stars}
                      </p>
                      <FaStar className="xsm:h-3 xsm:w-3 md:h-2 xsm:w-2 text-white xsm:text-xs md:text-base" />
                    </div>
                  ) : (
                    <div className="text-gray-500 md:text-base xsm:text-xs">
                      no reviews
                    </div>
                  )}
                </div>
                <br></br>
                <div className="mt-auto w-full ">
                  <button
                    id="addcart"
                    className="h-12 w-full xsm:text-xs md:text-base mx-auto flex items-center justify-center bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors duration-300"
                    onClick={(e) => {
                      console.log(product);
                      e.stopPropagation();
                      handleCart(
                        e,
                        product.id,
                        product.sizes[0],
                        product.images[0][1][0].colorname
                      );
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
        </div>
        {/* <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-[40px] w-[98px] rounded-md shadow-black bg-blue-300 text-sm">
      Shop now
    </button> */}
        {/* </div> */}
        {/* blog */}
        {/* <div className="h-[60%] xxsm:h-[90%] sm:h-[120%] md:h-[150%] w-full gap-2 p-2">
          <div className="h-[10%]">
            <h1 className="xsm:text-sm">Blog posts</h1>
          </div>
          <div className="h-[90%] w-full bg-gray-300 grid grid-cols-[2fr_1fr] gap-0.5 p-1 rounded-md">
            <div className="bg-red-100 grid grid-rows-2 gap-0.5">
              <div className="bg-blue-300"></div>
              <div className="grid grid-cols-2 gap-0.5">
                <div className="bg-red-400"></div>
                <div className="bg-pink-400"></div>
              </div>
            </div>
            <div className="bg-blue-100 grid grid-rows-2 gap-0.5">
              <div className="bg-yellow-200"></div>
              <div className="bg-pink-200"></div>
            </div>
          </div>
        </div> */}
        <Footer />
      </main>
    </div>
  );
};

export default Homepage;
