import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./mobile components/Footer";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {  MdDelete, MdEdit } from "react-icons/md";
import { useRef } from "react";
import { FiUpload } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

const Categories = ({ URI }) => {
  axios.defaults.withCredentials = true;
  const [popup, setPopup] = useState(false);
  const [editpopup, setEditPopup] = useState(false);
  const [sizePopup, setSizePopup] = useState(false);
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState("");
  const [style, setStyle] = useState([]);
  const [newStyle, setNewStyle] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [existanceAlert, setExistanceAlert] = useState(false);
  const [categoryExistance, setCategoryExistance] = useState([]);
  const [recall, setRecall] = useState(false);
  const imageRef = useRef(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [serverImages, setServerImages] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [styleId, setstyleId] = useState(null);
  const [borderClass, setBorderClass] = useState("outline-blue-500");
  const [isMatch, setIsMatch] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);

  const handleImageDisplay = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const aspectRatio = img.width / img.height;
          if (aspectRatio.toFixed(2) === (16 / 9).toFixed(2)) {
            setUploadedImages((prevImages) => [...prevImages, file]);
            setPreviewImages((prevPreviews) => [
              ...prevPreviews,
              reader.result,
            ]);
          } else {
            alert("Please upload images with a 16:9 aspect ratio.");
          }
        };
      };
      reader.readAsDataURL(file);
    });
  };
  // Handle deleting uploaded images
  const handleDelete = (index) => {
    const updatedImages = uploadedImages.filter((_, i) => index !== i);
    const updatedPreviews = previewImages.filter((_, i) => index !== i);
    setUploadedImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  const navigate = useNavigate();

  const handleEdit = async (index) => {
    const newImageFile = await new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (event) => {
        const file = event.target.files[0];
        resolve(file);
      };
      input.click();
    });

    if (newImageFile) {
      // Convert the file to base64 using FileReader
      const updatedImageBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1]; // Extract base64 string without the prefix
          resolve(base64String); // Return the base64 string
        };
        reader.onerror = reject; // Handle errors
        reader.readAsDataURL(newImageFile); // Start reading the file
      });

      // Update the specific image at the given index in serverImages state
      setServerImages(
        (prevImages) =>
          prevImages.map((img, ind) =>
            ind === index ? updatedImageBase64 : img
          ) // Update the image at the specified index
      );
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        console.log(response)
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data.category);
          setPopup(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getCategory();
  }, [recall]);

  const styledelete = (index) => {
    const filteredstyle = style.filter((_, ind) => ind !== index);
    setStyle(filteredstyle);
    setSizes((prevSizes) =>
      prevSizes.map((size, ind) => (index === ind ? null : size))
    );
  };

  const handleStyle = () => {
    if (!newStyle.trim("")) {
      alert("please enter valid style");
    } else if (style.includes(newStyle.toLowerCase())) {
      alert("style already created in this catgeory");
    } else {
      setStyle([...style, [newStyle, []]]); // Using Date.now() for a unique key
      setSizes([...sizes, null]);
      setNewStyle("");
    }
  };
  const handleCategory = async (e, index) => {
    e.preventDefault();
    let sty ;
    let size ; 
    if (e.target.id === "create") {
      sty = style.map((s) => s[0]);
      size = style.map((s) => s[1]);
    }
    if (e.target.id === "update") {
      sty = style.map((s) => s.style);
      size = style.map((s) => s.sizes);
    }

    if (
      !category.trim("") ||
      sty.includes("" || null) ||
      size.some((innerArr) => innerArr.length === 0) ||
      style.includes("")
    ) {
      return alert(
        "please Enter all fields and atleast one size for each style"
      );
    }
    let posters = [];
    if (e.target.id === "create") {
      posters = previewImages.map((images) => String(images.split(",")[1]));
    }
    try {
      const catg = {
        category: category.toLowerCase(),
        posters: e.target.id === "update" ? serverImages : posters,
        style: style,
      };
      const config = { headers: { "Content-Type": "application/json" } };
      let response;
      if (e.target.id === "create") {
        response = await axios.post(URI + "/createcategory", catg, config);
      }
      if (e.target.id === "update") {
        response = await axios.put(
          `${URI}/createcategory/update/${editId}`,
          catg,
          config
        );
      }

      if (response.status === 200) {
        alert(response.data.message);
        setExistanceAlert(false);
        setCategory("");
        setCategoryExistance([]);
        setStyle([]);
        setEditPopup(false);
        setRecall(!recall);
        setPreviewImages([]);
      }
    } catch (err) {
      if (err.data.message) alert(err.data.message);
    }
  };

  const handleEditStyles = (e, index, sizeIndex) => {
    const updatedValue = [...style];
    updatedValue.forEach((style, ind) => {
      if (ind === index) {
        style.sizes[sizeIndex] = e.target.value;
      }
    });
    setStyle(updatedValue);
  };

  const handleDel = async (e, index) => {
    const delItem = e.currentTarget.id === "sty" ? "style" : "category";
    const delId = e.currentTarget.id === "sty" ? index : editId;

    if (!delId) {
      alert("Error occurred. Please try again later.");
      return;
    }

    try {
      const response = await axios.delete(`${URI}/createcategory/delete/`, {
        params: { delItem, delId },
      });

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message);

        // Remove the item from the array only if the deletion was successful
        if (delItem === "style") {
          const updatedStyles = [...style]; // Create a shallow copy of the style array
          updatedStyles.splice(index, 1); // Remove the specific item from the array
          setStyle(updatedStyles); // Update the state with the modified array
        } else {
          setEditPopup(!editpopup);
          setRecall(!recall);
        }
      }
    } catch (err) {
      console.error(err.response ? err.response.data.message : err.message);
      if (err) alert(" Error occured please try again later");
    }
  };
  return (
    <div className="relative  h-[90%] w-full bg-white-800 rounded-md shadow-md">
      <main className="relative xsm:h-[95%] md:h-full w-[100%]  overflow-auto">
        <div className=" h-[10%] flex items-center  justify-between mb-8 mt-2 mx-auto">
          <h1 className="ml-2 text-xl font-bold ">CATEGORIES</h1>
          <button
            id="formopen"
            type="button"
            className="relative right-4 bg-blue-500 rounded lg:text-lg text-sm h-[70%] xsm:w-[20%] text-white font-semibold hover:shadow-md"
            onClick={(e) => {
              setPopup(!popup);
            }}
          >
            {" "}
            Create{" "}
          </button>
        </div>
        {categoryList.length > 0 &&
          categoryList.map((category, index) => {
            const capitalizedCategory =
              category.category.charAt(0).toUpperCase() +
              category.category.slice(1);

            return (
              <div
                id={capitalizedCategory}
                className="w-full xsm:w-[90%] md:w-[50%] mx-auto mb-4 px-6 py-2 cursor-pointer rounded-lg bg-blue-300 shadow-md hover:bg-blue-400 transition-all duration-200"
              >
                <div className="flex justify-between items-center">
                  <div
                    className="text-lg sm:text-xl md:text-2xl font-semibold break-words text-gray-700"
                    onClick={() => {
                      navigate(
                        `/admin/stylespage/?category=${capitalizedCategory}`
                      );
                    }}
                  >
                    {capitalizedCategory}
                  </div>
                  <MdEdit
                    className="h-6 w-6 text-gray-600 hover:text-gray-800 transition-colors duration-150 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const st = categoryList.find(
                        (data) => data.category === category.category
                      );
                      if (st) {
                        setStyle(st.style);
                        setServerImages(st.posters);
                      }
                      let cl = [...categoryList];
                      cl.splice(index, 1);
                      cl = cl.flatMap((category) => [category.category]);
                      setCategoryExistance(cl);
                      setEditId(category._id);
                      setCategory(category.category);
                      setEditPopup(!editpopup);
                    }}
                  />
                </div>
              </div>
            );
          })}
      </main>
      <footer className="h-[5%] w-full md:hidden xsm:block">
        <Footer />
      </footer>
      {popup && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full border-2 border-gray-300 bg-red-200 p-4 rounded-lg overflow-x-auto scrollbar-hidden ">
          <div className="h-[90%] w-full flex md:flex-row xsm:flex-col overflow-auto gap-2">
            <form className="relative md:h-full xsm:max-h-max md:w-[50%] xsm:w-full flex flex-col  overflow-x-auto scrollbar-hidden">
              <IoIosClose
                id="formclose"
                className="absolute top-2 right-2 h-8 w-8 cursor-pointer"
                onClick={(e) => {
                  setCategory("");
                  setNewStyle("");
                  setStyle([]);
                  setPopup(!popup);
                }}
              />

              <input
                type="text"
                required
                className={`border-2 flex-shrink-0 outline-blue-500 border-gray-300 h-12 w-full px-4 rounded-lg bg-blue-100  ${borderClass}`}
                value={category}
                onChange={(e) => {
                  const isCategoryValid = categoryList.some(
                    (cat) =>
                      e.target.value.toLowerCase() ===
                      cat.category.toLowerCase()
                  );
                  if (isCategoryValid) setBorderClass("outline-red-500");
                  else setBorderClass("outline-blue-500");

                  setCategory(e.target.value);
                }}
                placeholder="Enter Category Name"
              />
              <label className="text-sm mt-4">Add Image</label>
              <div className="relative h-24 mt-2 flex-shrink-0 w-full border-2 bg-white border-gray-300 rounded p-2 flex items-center gap-2">
                <input
                  type="file"
                  ref={imageRef}
                  className="opacity-0 ml-hidebuttons"
                  onChange={handleImageDisplay}
                />
                <FiUpload
                  className="sm:w-12 xsm:h-8 sm:h-12 xsm:w-8 cursor-pointer"
                  onClick={() => imageRef.current.click()}
                />
                <div className="relative h-full w-[90%] overflow-auto flex items-center gap-1">
                  {previewImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative max-h-max w-16 flex-shrink-0 flex flex-col gap-1"
                    >
                      <img
                        src={image}
                        className="h-16 w-16 rounded border-2 border-gray-500 p-0.5"
                        alt={`uploaded-${index}`}
                      />
                      <MdDelete
                        className="absolute top-1 right-1 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col flex-shrink-0 gap-4 mt-4">
                <input
                  type="text"
                  className={`border-2 h-12 ${borderClass} w-full px-4 rounded-lg bg-blue-100`}
                  value={newStyle}
                  onChange={(e) => {
                    let matched = false;
                    style.map((styl) => {
                      if (
                        styl[0].toLowerCase() === e.target.value.toLowerCase()
                      ) {
                        setBorderClass("outline-red-500"); // Set the border class
                        matched = true;
                        setIsMatch(true);
                      }
                    });

                    if (!matched) {
                      setBorderClass("outline-blue-500"); // Reset border class if no match
                      setIsMatch(false);
                    }

                    setNewStyle(e.target.value.toLowerCase());
                  }}
                  placeholder="Enter Style"
                />
                <button
                  type="button"
                  onClick={handleStyle}
                  className={`${
                    isMatch ? "opacity-50 cursor-not-allowed" : ""
                  } bg-blue-300 h-12 w-full rounded-lg border-2 border-gray-300`}
                  disabled={isMatch} // Disable button if there's a match
                >
                  Create Style
                </button>
              </div>
            </form>
            <div className=" h-full md:w-[50%] xsm:w-full flex-shrink-0 gap-2 rounded-lg  flex flex-col gap-2 py-2 scrollbar-hidden items-center overflow-x-auto ">
              {style.length > 0 &&
                style.map((item, index) => {
                  console.log(style)
                  const styles = style.filter((st) => st[0] !== item);
                  return (
                    <div
                      key={index}
                      className={`min-h-80 max-h-max w-full text-sm p-1 overflow-auto scrollbar-hidden flex-shrink-0 bg-yellow-200 items-center gap-2 border-2 ${
                        styles.includes(item[0].toLowerCase())
                          ? "border-red-500"                          
                          : "border-blue-300"
                      } rounded`}
                    >
                      <div className="h-[10%] w-full flex justify-end ">
                        <IoIosClose
                          id={index}
                          className=" text-lg cursor-pointer"
                          onClick={() => styledelete(index)}
                        />
                      </div>
                      <p className="top-2 xsm:text-xs md:text-base break-words  px-2 font-semibold">
                        {item[0]}
                      </p>
                      <div
                        className={`w-full h-12 flex items-center gap-2 px-2 }`}
                      >
                        <input
                          key={index}
                          type="text"
                          value={sizes[index] || ""} // Ensure `null` displays as an empty string
                          className={`w-[80%] h-8  ${
                            item[1].includes(sizes[index])
                              ? "outline-red-500"
                              : "outline-blue-500"
                          }`}
                          onChange={(e) => {
                            setSizes((prevSizes) =>
                              prevSizes.map((size, ind) =>
                                index === ind
                                  ? e.target.value.toLowerCase()
                                  : size
                              )
                            );
                          }}
                        />

                        <button
                          key={index}
                          className={`bg-blue-500 py-2 px-8 rounded ${
                            item[1].includes(sizes[index])
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          disabled={item[1].includes(sizes[index])}
                          onClick={() => {
                            const updatedStyle = [...style];

                            // Update `updatedStyle` directly
                            if (Array.isArray(updatedStyle[index][1])) {
                              updatedStyle[index][1].push(String(sizes[index]));
                            }

                            setStyle(updatedStyle);

                            // Update `sizes` to set the current index to null
                            setSizes((prevSizes) =>
                              prevSizes.map((size, ind) =>
                                index === ind ? null : size
                              )
                            );
                          }}
                        >
                          Add
                        </button>
                      </div>

                      {style.length > 0 &&
                        style.map(
                          (styl, index2) =>
                            Array.isArray(styl[1]) &&
                            styl[1].length > 0 &&
                            index === index2 && (
                              <div
                                key={index}
                                className="max-h-max min-h-24 w-full px-2 border-2 border-gray-600 mx-auto flex flex-wrap p-2 gap-2"
                              >
                                {styl[1].map((styl, sizeIndex) => (
                                  <p
                                    key={sizeIndex}
                                    className="border-2 flex border-gray-300 max-w-max bg-pink-300 h-8 gap-2 bg-white items-center px-2 py-1"
                                  >
                                    {styl}
                                    <IoIosClose
                                      className="text-lg cursor-pointer"
                                      onClick={() => {
                                        const updatedStyle = [...style];

                                        updatedStyle.forEach((sty, ind) => {
                                          if (
                                            index === ind &&
                                            Array.isArray(sty[1])
                                          ) {
                                            // Filter out the specific value or condition you want to remove
                                            sty[1] = sty[1].filter(
                                              (_, i) => i !== sizeIndex
                                            );

                                            // Ensure `sty[1]` is an empty array if all elements are removed
                                            if (sty[1].length === 0) {
                                              sty[1] = [];
                                            }
                                          }
                                        });
                                        setStyle(updatedStyle);
                                      }}
                                    />
                                  </p>
                                ))}
                              </div>
                            )
                        )}
                    </div>
                  );
                })}
            </div>
          </div>
          <button
            id="create"
            onClick={(e) => {
              handleCategory(e);
            }}
            type="submit"
            className="bg-blue-500 h-12 w-full flex-shrink-0 rounded-lg border-2 border-gray-300 mt-4"
          >
            Create Category
          </button>
        </div>
      )}
      {editpopup && style && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full border-2 border-gray-300 bg-red-200 p-4 rounded-lg overflow-auto">
          <div className="w-full flex items-center justify-end mb-2">
            <IoIosClose
              id="formclose"
              className="relative h-8 w-8 cursor-pointer"
              onClick={() => {
                setSizePopup(false);
                setExistanceAlert(false);
                setCategory(" ");
                setStyle([]);
                setEditPopup(!editpopup);
              }}
            />
          </div>
          <div
            className={`relative flex items-center mb-4 border-2  ${
              categoryExistance.includes(category.toLowerCase())
                ? "border-red-500"
                : "border-gray-300"
            }  min-h-12 max-h-max w-full flex items-center justify-between rounded-lg bg-blue-100`}
          >
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (categoryExistance.includes(e.target.value.toLowerCase())) {
                  setExistanceAlert(!existanceAlert);
                } else {
                  setExistanceAlert(false);
                }
              }}
              className={`outline-none h-12 w-[80%] px-4 flex items-cente justify-between rounded-lg bg-blue-100`}
            />

            <MdDelete
              id="catg"
              className="h-6 w-[20%] right-4 top-1 text-red-600 cursor-pointer"
              onClick={(e) => {
                setDeletePopup(true);
              }}
            />
          </div>
          {deletePopup && (
            <div className=" h-full w- full flex items-center justify-center  bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col gap-4">
                <h2 className="text-lg font-semibold">
                  Are you sure want to delete Category
                </h2>

                <div className="flex justify-end gap-4">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setDeletePopup(false);
                    }} // Close the popup
                  >
                    No
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={(e) => handleDel(e, category)} // Submit password
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="p-2 aspect[16/9] flex flex-col items-center mb-2">
            <div className="relative h-full w-full  flex justify-center items-center">
              {serverImages.length > 0 ? (
                <img
                  src={`data:image/png;base64,${serverImages[0]}`}
                  className="h-full w-full"
                  alt="slideshow"
                />
              ) : (
                <p>No images to display</p>
              )}
              {/* Edit and Delete Buttons */}
              {serverImages.length > 0 && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <MdEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEdit(0)}
                  />
                </div>
              )}
              {/* Arrow Buttons */}
            </div>
          </div>
          <buttton
            className="max-h-max max-w-max px-4 py-2 bg-blue-500 text-white rounded top-2 "
            onClick={() => {
              setStyle([...style, { style: "", sizes: [] }]);
              setstyleId(style.length);
              setSizePopup(true);
            }}
          >
            add Style
          </buttton>

          {style &&
            style.map((s, index) => {
              const fs = style.map((item) => item[0]);
              return (
                <>
                  <div
                    id={index}
                    className={`relative flex items-center border-2
                   min-h-12 max-h-max w-full flex items-center justify-between rounded-lg bg-blue-100 mt-4`}
                  >
                    <input
                      type="text"
                      value={s.style}
                      onChange={(e) => {
                        fs.includes(e.target.value.toLowerCase())
                          ? setExistanceAlert(!existanceAlert)
                          : setExistanceAlert(false);
                        const updated = [...style];
                        updated.map((styl, inde) => {
                          if (index === inde) {
                            styl.style = e.target.value;
                          }
                          setStyle(updated);
                        });
                      }}
                      className="outline-none h-12 w-[80%] px-4 flex items-center justify-between rounded-lg bg-blue-100"
                    />
                    <IoIosArrowDown
                      key={index}
                      className="h-6 w-[20%] right-2 top-1 text-black cursor-pointer"
                      onClick={() => {
                        setstyleId(index);
                        setSizePopup(!sizePopup);
                      }}
                    />
                  </div>
                  {sizePopup && index === styleId && (
                    <div className="max-h-max w-full border-2 border-white border-t-0 rounded p-4 mb-4">
                      <buttton
                        className="max-h-max max-w-max px-4 py-2 bg-blue-500 text-white rounded mb-2 "
                        onClick={() => {
                          console.log(style);
                          const updated = [...style];
                          updated[index].sizes.push(null);
                          setStyle(updated);
                        }}
                      >
                        add Size
                      </buttton>
                      <buttton
                        className="max-h-max max-w-max px-4 py-2 bg-red-500 text-white rounded mb-2 ml-4"
                        onClick={() => {
                          setSizePopup(!sizePopup);
                          const updated = style.filter(
                            (_, ind) => ind !== index
                          );
                          setStyle(updated);
                        }}
                      >
                        delete Style
                      </buttton>
                      {s.sizes?.map((s, sizeIndex) => (
                        <div className="mb-2 mt-4 flex justify-between items-center">
                          <input
                            type="text"
                            value={s}
                            onChange={(e) => {                             
                              handleEditStyles(e, index, sizeIndex);
                            }}
                            className="outline-none h-12 w-[80%] px-4 flex items-center justify-between rounded-lg bg-blue-100"
                          />
                          <MdDelete
                            id="sty"
                            className="h-6 w-[20%] right-4 top-1 text-red-600 cursor-pointer"
                            onClick={() => {
                              const updated = [...style];
                              updated[index].sizes.splice(sizeIndex, 1);
                              setStyle(updated);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })}

          <button
            className="h-12 w-24 mt-4 flex items-center justify-center mx-auto border-2 borzder-gray-300 font-bold rounded bg-blue-300"
            id="update"
            onClick={(e) => {
              if (existanceAlert) {
                alert("Entered fields are already Exists");
              } else {
                handleCategory(e);
              }
            }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Categories;
