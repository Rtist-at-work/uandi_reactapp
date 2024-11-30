import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./mobile components/Footer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const StylesPage = () => {
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [productList, setProductList] = useState([]);
  const [categorynav, setCategorynav] = useState([]);
  const location = useLocation();
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const handleproductlist = (e) => {
    navigate(`/admin/productpage/?stylenav=${e.target.id}&categorynav=${categorynav}`);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category");
    setCategorynav(()=>queryParams.get("category"))
    const getproducts = async () => {
      try {
        const response = await axios.get(
          `${URI}/productList/?categorynav=${category}`
        );
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          setProductList(response.data.products);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getproducts();

    const getCategory = async () => {
      const category = queryParams.get("category");
      try {
        const response = await axios.get(
          `${URI}/category/?categorynav=${category}`
        );
        if (response.status === 200 || response.status === 201) {
          const sl = response.data.category.filter(
            (c) => c.category.toLowerCase().trim(" ") === category.toLowerCase().trim(" ")
          );
          setFilteredStyles(sl);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCategory();
  }, []);

  const categoryForm = (e) => {
    e.target.id === "formopen" ? setPopup(true) : setPopup(false);
  };
  console.log(filteredStyles)
  return (
    <div className=" h-[90%] w-full  rounded-md shadow-md p-4">
      <main className="xsm:h-[95%] md:h-full w-[100%]  overflow-auto scrollbar-hidden">
        <h1 className=" h-[10%] ml-2 text-xl font-bold ">STYLES</h1>
        {filteredStyles.length > 0 && filteredStyles[0].style.length > 0 ? (
          filteredStyles[0].style.map((s) => {
            let cat = productList.filter(
              (product) => product.style === s.style
            );
            return (
              cat.length >0 && (
                <div
                id="container"
                key={s.key}
                className="h-[20%] w-[100%] xxsm:h-[35%] xsm:h-[25%] sm:h-[40%] px-4 mt-4"
              >
                <div
                  id="headerContainer"
                  className="h-[30%] sm:h-[20%] w-[100%] py-2 flex items-center justify-between"
                >
                  <p className="font-semibold md:text-md xsm:text-base">
                    {s.style}
                  </p>
                  <p
                    id={s.style}
                    onClick={(e) => {
                      handleproductlist(e);
                    }}
                    className=" underline text-sm  cursor-pointer"
                  >
                    See all
                  </p>
                </div>

                <div
                  id="imageContainer"
                  className=" flex gap-2 p-2 h-[70%] w-[100%]  overflow-x-auto   scrollbar-hidden"
                >
                  {cat.length > 0 &&
                    cat.map((catItem, imgIndex) => {
                      if (catItem.images.length > 0) {
                        return (
                          <div
                            key={`${imgIndex}`}
                            className="flex flex-shrink-0 gap-2 p-0.5 h-[100%] aspect-[1/1] rounded overflow-hidden overflow-x-auto border-2 border-gray-300"
                          >
                            <img
                              src={catItem.images[0][0][0]}
                              alt={`product-${imgIndex}`}
                              className="h-[100%] w-[100%] "
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div
                            key={`${imgIndex}`}
                            className="flex flex-shrink-0 gap-2 p-0.5 h-[100%] sm:w-[25%] xsm:w-[25%] xxsm:w-[25%] md:w-[20%] lg:w-[12%] rounded overflow-hidden overflow-x-auto border-2 border-gray-300 text-sm"
                          >
                            No Images Found
                          </div>
                        );
                      }
                    })}
                </div>
                <hr></hr>
              </div>
              )
            );
          })
        ) : (
          <div className="h-full w-full flex items-center justify-center font-bold text-xl">
            No Products
          </div>
        )}
      </main>

      <footer className="h-[5%] w-ful md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};

export default StylesPage;
