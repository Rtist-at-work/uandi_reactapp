import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { TbBookUpload } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import Footer from "./mobile components/Footer";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditProduct = ({ URI }) => {
  axios.defaults.withCredentials = true;
  const colorRef = useRef(null);

  const uploadRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState();
  const [category, setCategory] = useState();
  const [description, setDescription] = useState();
  const [offer, setOffer] = useState();
  const [style, setStyle] = useState();
  const [size, setSize] = useState([]);
  const [isCategory, setIsCategory] = useState({});
  const [stockStatus, setStockStatus] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [images, setImages] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [colors, setColors] = useState([]);
  const [colorGroup,setColorGroup] = useState([]);
  const [uploadedColor,setUploadedColor] = useState([]);
  const pid = new URLSearchParams(useLocation().search).get("id");

  const navigate = useNavigate();

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data.category);
        }
      } catch (err) {
        console.log(err);
      }
    };   

    const getProduct = async () => {
      try {
        const response = await axios.get(`${URI}/productList`, {
          params: {
            productDetails: pid,
          },
        });
        if (response.status === 200 || response.status === 201) {
          setName(response.data.products[0].name);
          setPrice(response.data.products[0].price);
          setCategory(response.data.products[0].category); // Set category here
          setDescription(response.data.products[0].description);
          setOffer(response.data.products[0].offer);
          setStockStatus(response.data.products[0].stock);
          setStyle(response.data.products[0].style);
          setSize(response.data.products[0].sizes);
          setUploadedColor(() =>
            response.data.products[0].images.map((img)=>img)
          );               
          
        }
      } catch (err) {
        console.log(err);
        alert("An error occurred, please try again later!");
      }
    };

    // Load categories first, then the product
    getCategory().then(getProduct);
  }, [pid]);
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "price") setPrice(value);
    if (id === "offer") setOffer(value);
    if (id === "category") {
      setCategory(value);
    }
    if (id === "style") {
      setStyle(value);
      setSize([]);
    }
    if (id === "description") setDescription(value);
  };
  const handleStock = (e) => {
    const { value } = e.target;
    setStockStatus(value);
  };

  const handlesize = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSize([...size, value]);
    }
    if (!checked) {
      const filteredSize = size.filter((s) => s !== value);
      setSize(filteredSize);
    }
  };
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${URI}/editproducts/deleteProducts`,
        {
          params: { editId: pid }, // Sending editId as a query parameter
        }
      );
      if (response.status === 200 || response.status === 201) {
        alert(response.data.message);
        navigate(`/admin/productpage/?stylenav=${style}`);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (category && categoryList.length > 0) {
      const filteredCategory = categoryList.filter(
        (cat) => cat.category.toLowerCase().trim(" ") === category.toLowerCase().trim(" ")
      );
      setIsCategory(filteredCategory);
    }
  }, [category, categoryList]);

  const handleButtonClick = (e) => {
    if (e.currentTarget.id === "color") colorRef.current.click();
    else if (e.currentTarget.id === "image") uploadRef.current.click();
  };

  const handleImageUpload = (e) => {
    let files = Array.from(e.target.files);
    const updated = [...colorGroup];

    if (files.length > 0) {
      const imageUrls = files.map((file) => {
        // Ensure colorGroup[colorIndex] is defined
        if (!updated[colorIndex]) {
          updated[colorIndex] = [[], []]; // Initialize as two empty arrays
        }
        if (e.target.id === "image") {
          // Push file to images array
          updated[colorIndex][0] = [...updated[colorIndex][0], file];
        }
        if (e.target.id === "color") {
          // Push file to colors array
          updated[colorIndex][1] = [file];
        }
        return URL.createObjectURL(file);
      });

      // Update the image or color URLs for display
      if (e.target.id === "image") {
        setImages([...images, ...imageUrls]);
      }
      if (e.target.id === "color") {
        setColors([...imageUrls]); // Updated to use colors state
      }

      setColorGroup(()=>updated.filter((u)=>u!=undefined)); // Update colorGroup state
    }
  };
  

  const validateForm = () => {
    if (
      !name ||
      !price ||
      !category ||
      offer.length === 0 ||
      !stockStatus ||
      size.length === 0 ||
      !description ||
      uploadedColor.length === 0
    ) {
      alert("Please fill out all fields and upload at least one image.");
      return false;
    }
    return true;
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    const formdata = new FormData();

    formdata.append("name", name);
    formdata.append("price", price);
    formdata.append("offer", offer);
    formdata.append("stock", stockStatus);
    Array.from(size).forEach((size) => formdata.append("sizes", size));
    formdata.append("category", category);
    formdata.append("style", style);
    formdata.append("description", description);
    colorGroup.forEach((group, index) => {
      // Append product images to 'productImages'
      group[0].forEach((file) => {
        formdata.append('productImages', file); // Append the file
      });
      formdata.append(`productImageslength`, `${group[0].length}`); // Append the metadata
    
      // Append color images to 'colorImages'
      group[1].forEach((file) => {
        formdata.append('colorImages', file);        
      });
    
    });
  
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.put(
        `${URI}/editproducts/${pid}`,
        formdata,
        config
      );
      console.log(response)
      if (response.status === 200 || response.status === 201) {
        setName("");
        setPrice("");
        setOffer("");
        setStockStatus("");
        setSize([]);
        setCategory("");
        setDescription("");
        setImages([]);
        setColors([]);
        setUploadedColor([]);
        setColorGroup([]);
        alert("Product Edited successfully");
        navigate(`/admin/productpage/?stylenav=${style}&categorynav=${category}`);
      }
    } catch (err) {
      console.log("Error adding product:", err);
    }
  };
  const handleDeleteImages = async(colorname,index)=>{
    try{
      const response = await axios.delete(
        `${URI}/editproducts/deleteColor/${pid}`,{
        params : {'colorname' : colorname}}
      );
      if(response.status===200 || response.status===201){
        setUploadedColor(()=>uploadedColor.filter((_,ind)=>index!=ind))
      }
    }
    catch(err){
      console.log(err)
    }
  }
  return (
    <div className="absolute  h-[90%] w-full rounded-md shadow-md">
      <div className="relative xsm:h-[95%] md:h-full w-[100%]  overflow-hidden scrollbar-hidden p-2">
        <header className="flex justify-between items-center px-4">
          <h1 className="text-xl font-bold xsm:text-base">EDIT PRODUCT</h1>
          <button
            className="mr-[5%] max-w-max max-h-max px-4 p-2 bg-red-500 hover:shadow-md cursor-pointer rounded-s-full font-semibold text-white rounded-e-full"
            onClick={() => {
              handleDelete();
            }}
          >
            Delete
          </button>
        </header>

        <main className="relative px-8 h-[95%] w-full py-4 overflow-y-auto scrollbar-hidden">
          <form
            className="flex flex-col space-y-4 max-h-max w-full"
            onSubmit={handleFormSubmission}
          >
            <label htmlFor="name"> NAME </label>
            <input
              type="text"
              id="name"
              name="Name"
              placeholder="Product Name"
              className="h-12 rounded border-2 border-gray-300 px-4 bg-blue-50 outline-blue-500"
              onChange={handleChange}
              value={name}
            />
            <label htmlFor="price"> PRICE </label>
            <input
              type="number"
              id="price"
              name="Price"
              placeholder="Price"
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4 bg-blue-50 outline-blue-500"
              onChange={handleChange}
              value={price}
            />
            <label htmlFor="price"> OFFER </label>
            <input
              type="number"
              id="offer"
              onWheel={(e) => e.target.blur()}
              name="offer"
              placeholder="offer %"
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4 bg-blue-50 outline-blue-500"
              onChange={handleChange}
              value={offer}
            />
            <label htmlFor="category"> CATEGORY </label>
            <select
              id="category"
              name="Category"
              className="h-12 rounded border-2 border-gray-300 px-2"
              value={category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categoryList.length ? (
                categoryList.map((category) => (
                  <option key={category._id} value={category.category}>
                    {category.category}
                  </option>
                ))
              )
               : (
                <div className="h-[10%] flex items-center rounded border-gray-300 border-2 border-gray-300">
                  No categories found
                </div>
              )}
            </select>
            <label htmlFor="category"> STYLE </label>
            <select
              id="style"
              name="style"
              className="h-12 rounded border-2 border-gray-300 px-2"
              value={style}
              onChange={handleChange}
            >
              <option>Select Style</option>
              {isCategory.length > 0 &&
                isCategory[0].style.map((style, index) => {
                  return <option key={index}>{style.style}</option>;
                })}
            </select>
            <label>SIZES</label>
            <div className="max-h-max w-full flex flex-wrap gap-4 px-4">
              {isCategory.length > 0 &&
                isCategory[0].style.map((styl, index) => {
                  return (
                    styl.style === style &&
                    styl.sizes.map((sty, ind) => (
                      <label className="flex items-center space-x-2">
                        <input
                          value={sty}
                          type="checkbox"
                          checked={size.includes(sty)}
                          onChange={(e) => {
                            handlesize(e);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">{sty}</span>
                      </label>
                    ))
                  );
                })}
            </div>
            <label>STOCK</label>
            <div className="max-h-max w-full flex flex-wrap gap-4 px-4">
              <label className="flex items-center space-x-2">
                <input
                  id="stock"
                  type="checkbox"
                  value="In Stock"
                  checked={stockStatus === "In Stock"}
                  onChange={handleStock}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  id="stock 1"
                  type="checkbox"
                  value="Out Of Stock"
                  checked={stockStatus === "Out Of Stock"}
                  onChange={handleStock}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-blue-50 outline-blue-500"
                />
                <span className="text-sm font-medium">Out Of Stock</span>
              </label>
            </div>

            <label htmlFor="description"> DESCRIPTION </label>
            <textarea
              id="description"
              name="Description"
              placeholder="Description"
              className="h-32 rounded overflow-y-auto border-2 border-gray-300 px-4 py-2 bg-blue-50 outline-blue-500"
              onChange={handleChange}
              value={description}
            />
            <label htmlFor="image"> IMAGE </label>
            <div className="flex p-2 h-24 w-full border-2 border-gray-300 rounded">
              <input
                type="file"
                multiple
                id="image"
                name="Image"
                ref={uploadRef}
                className="opacity-0 ml-hidebuttons "
                onChange={(e) => {
                  handleImageUpload(e);
                }}
              />
              <TbBookUpload
                id="image"
                className="h-[100%] w-[10%] cursor-pointer"
                onClick={(e) => {
                  handleButtonClick(e);
                }}
              />
              <div className="flex h-[100%] w-[90%] overflow-x-auto">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div className=" relative h-[100%] aspect-[1/1] rounded ml-2 shrink-0 ">
                      <img
                        key={index}
                        src={image}
                        alt={`Uploaded ${index}`}
                        className="h-full aspect-[1/1] rounded"
                      />
                      <MdDelete
                        id="image"
                        className="absolute right-1 top-1 text-red-600 text-lg"
                        onClick={(e) => {
                          setImages(()=>images.filter((_,ind)=>ind!=index))
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>No images uploaded</p>
                )}
              </div>
            </div>
            <label htmlFor="color"> COLORS </label>

            <div className="flex p-2 h-24 gap-4 w-full border-2 border-gray-300 rounded">
              <input
                type="file"
                multiple
                id="color"
                name="color"
                ref={colorRef}
                className="opacity-0 ml-hidebuttons "
                onChange={(e) => {
                  handleImageUpload(e);
                }}
              />
              <TbBookUpload
                id="color"
                className="h-[100%] w-[10%] cursor-pointer"
                onClick={(e) => {
                  handleButtonClick(e);
                }}
              />
              <div className="relative h-full w-[90%] overflow-auto flex items-center gap-1">
                {colors.length > 0 &&
                  colors.map((image, index) => (
                    <div
                      key={index}
                      className="relative max-h-max w-16 flex-shrink-0 flex flex-col gap-1"
                    >
                      <img
                        src={image}
                        className="h-16 w-16 rounded border-2 border-gray-500 p-0.5"
                      />
                      <MdDelete
                        id="color"
                        className="absolute top-1 right-1 text-red-500 cursor-pointer"
                        onClick={(e) => {
                          setColors(()=>colors.filter((_,ind)=>ind!=index))
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <button
              className="max-h-max max-w-max py-2 px-4 rounded bg-blue-500 text-white lg:font-medium text-sm items-bottomrounded border-2  "
              type="button"
              onClick={() => {
                if(colors.length<=0) alert("please Select color")
                else{
                  setColorIndex(() => colorIndex + 1);
                  setUploadedColor([...uploadedColor,colors[colors.length-1]]);
                  setImages([]);
                  setColors([]);}
              }}
            >
              ADD COLORS
            </button>
            <label htmlFor="color"> PRODUCT COLORS UPLOADED</label>
            <div className="flex p-2 h-24 gap-4 w-full border-2 border-gray-300 rounded">
              <div className="relative h-full w-[90%] overflow-auto flex items-center gap-1">
                {uploadedColor.length > 0 &&
                  uploadedColor.map((image, index) => (
                    <div
                      key={index}
                      className="relative max-h-max w-16 flex-shrink-0 flex flex-col gap-1"
                    >
                      <img
                        src={image?.[1]?.[0]?.colorImage || image}
                        className="h-16 w-16 rounded border-2 border-gray-500 p-0.5"
                      />
                      <MdDelete
                        id="color"
                        className="absolute top-1 right-1 text-red-500 cursor-pointer"
                        onClick={(e) => {  
                          if(image?.[1]?.[0]?.colorImage){
                            handleDeleteImages(image?.[1]?.[0]?.colorname,index)
                          }                       
                           else{
                            setColorGroup(() =>
                              colorGroup.filter((_, ind) => ind != (index-((uploadedColor.length)-(colorGroup.length))))
                            );
                            setUploadedColor(() =>
                              uploadedColor.filter((_, ind) => ind != index)
                            );
                           }
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
            
            <button
              className="h-12 w-24 lg:font-medium text-sm items-bottom  rounded border-2 mx-auto"
              type="submit"
            >
              SAVE
            </button>
          </form>
        </main>
      </div>
      <footer className="h-[5%] w-full md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};
//mmvml

export default EditProduct;
