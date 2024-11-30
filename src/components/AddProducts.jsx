import React, { useState, useRef, useEffect } from "react";
import { TbBookUpload } from "react-icons/tb";
import axios from "axios";
import Footer from "./mobile components/Footer";
import { MdDelete } from "react-icons/md";

const AddProducts = ({ URI }) => {
  axios.defaults.withCredentials = true;
  const imageRef = useRef(null);
  const colorRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState("");
  const [OfferType,setOfferType] = useState();
  const [style, setStyle] = useState("");
  const [size, setSize] = useState([]);
  const [stockStatus, setStockStatus] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [isCategory, setIsCategory] = useState({});
  const [categoryList, setCategoryList] = useState([]);
  const [colorGroup, setColorGroup] = useState([]);
  const [colorIndex, setColorIndex] = useState(0);
  const [uploadedColor, setUploadedColor] = useState([]);

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
    getCategory();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "price") setPrice(value);
    if (id === "offer") setOffer(value);
    if (id === "category") {
      setCategory(value);
    }
    if (id === "style") setStyle(value);
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

  useEffect(() => {
    if (category) {
      const filteredCategory = categoryList.filter(
        (cat) => cat.category === category
      );
      setIsCategory(filteredCategory);
    }
  }, [category]);

  const handleButtonClick = (e) => {
    const id = e.target.id;
    if (id === "image") {
      imageRef.current.click();
    }
    if (id === "color") {
      colorRef.current.click();
    }
  };
  console.log(colorGroup)
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

      setColorGroup(updated); // Update colorGroup state
    }
  };
  const handleDel = (e, index) => {
    if (e.currentTarget.id === "image") {
      const filteredimages = images.filter((_, ind) => ind !== index);
      setImages(filteredimages);
    }

    if (e.currentTarget.id === "color") {
      const filteredcolors = colors.filter((_, ind) => ind !== index);
      setColors(filteredcolors); // Updated to use colors state
    }
  };

  const validateForm = () => {
    if (
      !name ||
      !price ||
      !category ||
      !offer ||
      !stockStatus ||
      size.length === 0 ||
      !description 
      // images.length === 0
    ) {
      alert("Please fill out all fields and upload at least one image.");
      return false;
    }
    return true;
  };
  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("offertype", OfferType);
    formData.append("offer", offer);
    formData.append("stock", stockStatus);
    Array.from(size).forEach((size) => formData.append("sizes", size));
    formData.append("category", category);
    formData.append("style", style);
    formData.append("description", description);
    colorGroup.forEach((group, index) => {
      console.log(group)
      // Append product images to 'productImages'
      group[0].forEach((file) => {
        formData.append('productImages', file); // Append the file
      });
      formData.append(`productImageslength`, `${group[0].length}`); // Append the metadata
    
      // Append color images to 'colorImages'
      group[1].forEach((file) => {
        formData.append('colorImages', file);
        
      });
    
    });
    
    
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.post(`${URI}/addproducts`, formData, config);

      // Clear form fields after success
      if (response.status === 200 || response.status === 201) {
        setSize([]);
        setName("");
        setPrice("");
        setOfferType("")
        setOffer("");
        setStockStatus("");
        setStockStatus([]);
        setCategory("");
        setStyle("");
        setDescription("");
        setImages([]);
        setColors([]);
        setColorGroup([]);
        setUploadedColor([]);
        alert("Product added successfully");
      }
    } catch (err) {
      // Check if the error message is related to the file format
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.error === "Give proper file format to upload"
      ) {
        alert("Give proper file format to upload");
      } else {
        console.log("Error adding product:", err);
        alert("An error occurred while adding the product");
      }
    }
  };
  return (
    <div className="absolute  h-[90%] w-full rounded-md shadow-md">
      <div className="relative xsm:h-[95%] md:h-full w-[100%]  overflow-hidden scrollbar-hidden p-2">
        <header className="text-xl mb-4 font-bold h-[5%] w-full ">
          ADD PRODUCT
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
              className="h-12 rounded border-2 border-gray-300 px-4"
              onChange={handleChange}
              value={name}
            />
            <label htmlFor="price"> PRICE </label>
            <input
              type="number"
              id="price"
              name="Price"
              placeholder="Price"
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4"
              onChange={handleChange}
              value={price}
            />
             <label htmlFor="category"> Offer Type </label>
            <select
              id="style"
              name="style"
              className="h-12 rounded border-2 border-gray-300 px-2"
              value={OfferType}
              onChange={(e)=>{
                setOfferType(()=>e.target.value)
              }}
            >
              <option>Select Offer Type</option>             
              <option>Flat offer</option>             
              <option>Percentage Offer</option>             
            </select>
            <label htmlFor="price"> OFFER </label>
            <input
              type="number"
              id="offer"
              onWheel={(e) => e.target.blur()}
              name="offer"
              placeholder="Enter discount % (e.g., 10)"
              className="h-12 rounded border-gray-300 border-2 border-gray-300 px-4"
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
              <option>Select category</option>
              {categoryList.length ? (
                categoryList.map((category) => (
                  <option key={category._id} value={category.category}>
                    {category.category}
                  </option>
                ))
              ) : (
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
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Out Of Stock</span>
              </label>
            </div>

            <label htmlFor="description"> DESCRIPTION </label>
            <textarea
              id="description"
              name="Description"
              placeholder="Description"
              className="h-32 rounded overflow-y-auto border-2 border-gray-300 px-4 py-2"
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
                ref={imageRef}
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
                          handleDel(e, index);
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
                          handleDel(e, index);
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
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
                        src={image}
                        className="h-16 w-16 rounded border-2 border-gray-500 p-0.5"
                      />
                      <MdDelete
                        id="color"
                        className="absolute top-1 right-1 text-red-500 cursor-pointer"
                        onClick={(e) => {
                          setColorGroup(() =>
                            colorGroup.filter((_, ind) => ind != index)
                          );
                          setUploadedColor(() =>
                            uploadedColor.filter((_, ind) => ind != index)
                          );
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
                if(colors.length<=0 || images.length <=0) alert("please Select color and Images")
                  else{
                    setColorIndex(() => colorIndex + 1);
                    setUploadedColor([...uploadedColor,colors[colors.length-1]]);
                    setImages([]);
                    setColors([]);}
              }}
            >
              ADD COLORS
            </button>
            <button
              className="max-h-max max-w-max py-2 px-4 rounded bg-blue-500 text-white lg:font-medium text-sm items-bottomrounded border-2  mx-auto"
              type="submit"
            >
              SAVE PRODUCT
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

export default AddProducts;
