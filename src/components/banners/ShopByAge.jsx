import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa6";

const ShopByAge = () => {
  const URI = "http://localhost:5000";

  const [imageUpload, setImageUpload] = useState(false);
  const [container1, setContainer1] = useState([]); // for displaying image previews
  const [container1Upload, setContainer1Upload] = useState([]); // for uploading images to the backend
  const [age, setAge] = useState([]); // ages corresponding to images
  const [banner, setBanner] = useState([]); // fetched banners
  const [allDetails,setAllDetails] = useState([])
  const imageRef_1 = useRef(null);
  const [ageBanner, setAgeBanner] = useState([]);
  const [dropdown, setDropDown] = useState([]);
  const [recall,setRecall] = useState(false);

  // Fetch banners on component mount
  useEffect(() => {
    const bannerFetch = async () => {
      try {
        const response = await axios.get(`${URI}/banners/fetchage`);
        if (response.status === 200 || response.status === 201) {
          setDropDown(response.data.sizes);
          setAllDetails(response.data.agebanner)
          setBanner(response.data.agebanner.imagesData);
          setAgeBanner(response.data.agebanner.imagesData.slice(0, 5));
        }
      } catch (err) {
        console.log(err);
      }
    };
    bannerFetch();
  }, [recall]);
  // Handle image upload display
  const handleImageDisplay = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = files.map((file) => URL.createObjectURL(file));
      setContainer1((prevImages) => [...prevImages, ...newImages]);
      setContainer1Upload((prevUpload) => [...prevUpload, ...files]); // Store actual files for uploading
    }
  };

  // Handle deleting an image and corresponding age
  const handleDelete = (index) => {
    const updatedContainer1 = container1.filter((_, i) => index !== i);
    const updatedContainer1Upload = container1Upload.filter(
      (_, i) => index !== i
    );
    const updatedAge = age.filter((_, i) => index !== i);
    setContainer1(updatedContainer1);
    setContainer1Upload(updatedContainer1Upload);
    setAge(updatedAge);
  };

  // Handle age input change
  const handleAge = (e, index) => {
    const updatedAge = [...age];
    updatedAge[index] = e.target.value;
    setAge(updatedAge);
  };

  // Handle form submission to backend
  const handleFormSubmission = async () => {
    if (age.includes(undefined) || container1.length !== age.length) {
      return alert("Please fill all the age fields");
    }

    const formData = new FormData();
    container1Upload.forEach((image) => {
      formData.append("images", image); // Append each image
    });

    age.forEach((ageItem, index) => {
      formData.append(`age[${index}]`, ageItem); // Append each age
    });

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.post(`${URI}/banners/age`, formData, config);
      setContainer1([]); // Clear images after submission
      setAge([]); // Clear ages after submission
      setContainer1Upload([]); // Clear uploaded images
      setRecall(!recall)
      alert(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while uploading the files.";
      alert(errorMessage);
    }
  };
  return (
    <div className="relative h-[30%] xxsm:h-[40%] sm:h-[50%] md:h-[60%] overflow-hidden mt-4 w-full z-0">
      <div className="h-[25%] w-full flex items-center justify-between p-2">
        <h1 className="xsm:text-sm">Shop by Age</h1>
        <button
          className="max-h-max min-w-max p-2 rounded border-2 border-gray-200 bg-blue-500 text-white sm:text-sm xsm:text-xs cursor-pointer"
          onClick={() => setImageUpload(!imageUpload)}
        >
          Add Age
        </button>
      </div>
      {imageUpload && (
        <div className="absolute inset-0 h-full w-full flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
          <div className="relative max-h-max w-[70%] flex flex-col gap-2 border-2 p-4 border-blue-500 bg-white rounded">
            <MdCancel
              className="absolute text-red-500 right-2 top-2 text-lg cursor-pointer"
              onClick={() => setImageUpload(!imageUpload)}
            />
            <label className="text-sm">Add Image</label>
            <div className="relative h-32 w-full border-2 border-gray-300 rounded p-2 flex items-center gap-2">
              <input
                type="file"
                ref={imageRef_1}
                required
                multiple
                className="opacity-0 ml-hidebuttons"
                onChange={handleImageDisplay}
              />
              <FiUpload
                className="sm:w-12 xsm:h-8 sm:h-12 xsm:w-8 cursor-pointer"
                onClick={() => imageRef_1.current.click()}
              />
              <div className="relative h-full w-[90%] overflow-auto flex items-center gap-1">
                {container1.length > 0 &&
                  container1.map((image, index) => (
                    <div
                      key={index}
                      className="relative max-h-max w-16 flex-shrink-0 flex flex-col gap-1"
                    >
                      <img
                        src={image}
                        className="h-16 w-16 rounded border-2 border-gray-500 p-0.5"
                      />
                      <MdDelete
                        className="absolute top-1 right-1 text-red-500 cursor-pointer"
                        onClick={() => handleDelete(index)}
                      />
                      <select
                        id="style"
                        name="style"
                        className="max-h-max rounded border-2 border-gray-300 px-2 outline-blue-500"
                        value={age[index]}
                        onChange={(e)=>{handleAge(e,index)}}
                      >
                        <option>Select Style</option>
                        {dropdown.length > 0 &&
                          dropdown.map((style, index) => {
                            console.log(style)
                            return <option key={index}>{style}</option>;
                          })}
                      </select>
                    </div>
                  ))}
              </div>
            </div>
            <button
              className="max-h-max p-2 text-sm text-white mx-auto mt-4 w-16 rounded border-2 border-gray-200 bg-blue-500"
              onClick={handleFormSubmission}
            >
              Save
            </button>
          </div>
        </div>
      )}
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

        <div className="relative flex gap-2 items-center sm:overflow-hidden xsm:overflow-y-hidden sm:w-[96%] xsm:mt-4 xsm:w-full h-full ">
          {ageBanner &&
            ageBanner.map((bannerItem, index) => {
              return (
                <div
                  key={index}
                  className="w-[20%] sm:flex xsm:hidden flex-col gap-2 items-center justify-center aspect-[1/1]"
                >
                  <div className="w-full ">
                    <MdDelete
                      className="text-red-600 text-xl ml-auto cursor-pointer"
                      onClick={async () => {
                        try {
                          const response = await axios.get(
                            `${URI}/banners/delete`,
                            {
                              params: { delId: allDetails[index]._id },
                            }
                          );
                          if (
                            response.status === 200 ||
                            response.status === 201
                          ) {
                            setBanner(() =>
                              banner.filter(
                                (banner) => banner._id != bannerItem._id
                              )
                            );
                            setAgeBanner(banner.slice(1, 6));
                            alert("banner deleted succesfully");
                          }
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                    />
                  </div>
                  <img
                    src={bannerItem}
                    className="w-[70%] aspect-[1/1] rounded-full object-cover"
                    alt={`img-${index}`}
                  />
                  <p className="h-[20%] max-w-max ">
                    {allDetails[index].age || "Age not available"}
                  </p>
                </div>
              );
            })}
          {banner &&
            banner.map((bannerItem, index) => {
              return (
                <div
                  key={index}
                  className="relative h-full sm:hidden shrink-0 xsm:flex flex-col items-center justify-center aspect-[1/1] scrollbar-hidden"
                >
                  <div className="absolute top-0 right-0 w-full ">
                    <MdDelete
                      className="text-red-600 text-xl ml-auto cursor-pointer"
                      onClick={async () => {
                        try {
                          const response = await axios.get(
                            `${URI}/banners/delete`,
                            {
                              params: { delId: bannerItem._id },
                            }
                          );
                          if (
                            response.status === 200 ||
                            response.status === 201
                          ) {
                            setBanner(() =>
                              banner.filter(
                                (banner) => banner._id != bannerItem._id
                              )
                            );
                            setAgeBanner(banner.slice(1, 6));
                            alert("banner deleted succesfully");
                          }
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                    />
                  </div>
                  <img
                    src={bannerItem}
                    className="h-[70%] aspect-[1/1] rounded-full object-cover"
                    alt={`img-${index}`}
                  />
                  <p className="h-[20%]">
                    {allDetails[index].age || "Age not available"}
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
    </div>
  );
};
//mmvml

export default ShopByAge;
