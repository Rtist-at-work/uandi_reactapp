import React, { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Homepage from "./Homepage";
import AddProducts from "./AddProducts";
import EditProduct from "./EditProduct";
import Categories from "./Categories";
import Banners from "./banners/AllBanners";
import Orderlist from "./Orderlist";
import { useRef, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Policy from "./Policy";
import ProductPage from "./ProductPage";
import StylesPage from "./StylesPage";

const Container = ({ handleMenuBarToggle, isSidebarOpen }) => {
  const URI = "http://localhost:5000";

  const [filteredProduct, setFilteredProduct] = useState();
  const [catId, setCatId] = useState();
  const [editId, setEditId] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);

  // useEffect(()=>{
  //   const cl = localStorage.getItem('categoryList');
  //   const pl = localStorage.getItem('productList');
  //   console.log(JSON.parse(pl));
  //   const cat = JSON.parse(cl)
  //   setCategoryList(cat)
  //   setProductList(JSON.parse(pl))
  //    },[]);

  // const handleStyles = (e) => {
  //   console.log(e.target.id)
  //   const id = e.target.id;
  //   setCatId(id);
  //   hs(id);
  // };

  useEffect(() => {
    if (location.pathname === "/admin/stylespage") {
      hs(catId);
    }
  }, [catId, location.pathname]);

  // useEffect(() => {
  //   if (location.pathname === '/productpage'||location.pathname ==='/categories'||location.pathname ==='/editproducts') {
  //     handleproductlist(ei);
  //   }
  // }, [location.pathname]);

  const handleproductedit = (p) => {
    navigate(`/admin/editproducts/?editId=${p}`);
    // setEditId(p);
  };

  return (
    <div className="h-full w-full flex p-4 gap-4 ">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        ref={sidebarRef}
        handleMenuBarToggle={handleMenuBarToggle}
      />
      <div className=" relative h-[100%] md:w-[80%] xsm:w-full shadow-md">
        <Header
          handleMenuBarToggle={handleMenuBarToggle}
          isSidebarOpen={isSidebarOpen}
        />
        <Routes>
          
          <Route path="/admin/homepage" element={<Homepage />} />
          <Route
            path="/admin/addproducts"
            element={<AddProducts URI={URI} />}
          />
          <Route
            path="/admin/editproducts"
            element={<EditProduct URI={URI} />}
          />
          <Route path="/admin/banners" element={<Banners />} />
          <Route path="/admin/categories" element={<Categories URI={URI} />} />
          <Route
            path="/admin/stylespage"
            element={<StylesPage URI={URI} productList={productList} />}
          />
          <Route path="/admin/orderlists" element={<Orderlist />} />
          <Route
            path="/admin/productpage"
            element={
              <ProductPage
                filteredProduct={filteredProduct}
                handleproductedit={handleproductedit}
              />
            }
          />
        <Route path="/admin/policy" element={<Policy />} />

        </Routes>
      </div>
    </div>
  );
};

export default Container;
