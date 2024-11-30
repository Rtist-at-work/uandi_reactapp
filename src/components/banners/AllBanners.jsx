import axios from "axios";
import React, { useRef, useState } from "react";
import Footer from "../mobile components/Footer";
import { FiUpload } from "react-icons/fi";
import { MdCancel, MdDelete } from "react-icons/md";
import ShopByAge from "./ShopByAge";
import PosterBanner from "./PosterBanner";
import { useEffect } from "react";
import { MdEdit } from "react-icons/md";

const AllBanners = () => {
  const URI = "http://localhost:5000";
  const [imageUpload, setImageUpload] = useState(false);
  const [container1, setContainer1] = useState([]);
  const [container2, setContainer2] = useState(null);
  const [serverImages, setServerImages] = useState([]);
  const imageRef_1 = useRef(null);
  const imageRef_2 = useRef(null);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [action, setAction] = useState();
  const [imageId, setImageId] = useState([]);

  useEffect(() => {
    setCurrentSlide(slideshowIndex);
  }, [slideshowIndex]);

  useEffect(() => {
    const getPoster = async () => {
      try {
        const response = await axios.get(`${URI}/banners/fetchage`);
        if (response.status === 200 || response.status === 201) {
          setServerImages(response.data.mainbanner.imagesData);
          setImageId(() =>
            Object.entries(response.data.mainbanner)
              .slice(0, Object.entries(response.data.poster).length - 1)
              .map((o) => o[1]._id)
              .filter((p) => p != undefined)
          );
        }
      } catch (err) {
        console.log(err);
      }
    };
    getPoster();
  }, []);
  const handleImageDisplay = (e) => {
    const files = Array.from(e.target.files);

    if (files) {
      if (e.currentTarget.id === "model") {
        const newImages = [];
        let filesProcessed = 0;

        files.forEach((file) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            newImages.push(reader.result); // Store the base64 result
            filesProcessed++;

            // Once all files have been processed, update state
            if (filesProcessed === files.length) {
              const poster = newImages.map((image) => [image, null]);
              setContainer1((prevImages) => [...prevImages, ...poster]);
            }
          };
          reader.readAsDataURL(file); // Read file as base64
        });
      }

      if (e.currentTarget.id === "cloth") {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage = reader.result; // Get base64 image

          setContainer1((prevImages) =>
            prevImages.map((image, ind) => {
              if (ind === container2) {
                return [image[0], newImage]; // Update the second image
              }
              return image; // Return the unchanged image
            })
          );
        };
        reader.readAsDataURL(files[0]); // Read first file as base64
      }
    }
  };
  const handleDelete = (e, index) => {
    if (e.currentTarget.id === "model") {
      const updatedContainer1 = container1.filter((_, i) => index !== i);
      setContainer1(updatedContainer1);
    }
    if (e.currentTarget.id === "apparel") {
      const updatedContainer1 = container1.map((image, i) => {
        if (index === i) {
          // Set the second image to `null` if it matches `ind === 1`
          return image.map((img, ind) => (ind === 1 ? null : img));
        }
        return image; // Keep the rest of the images unchanged
      });

      setContainer1(updatedContainer1);
    }
  };
  
  const handleformsubmission = async () => {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const formData = new FormData();
    const images = container1.flat();
    // Fetch each Blob URL and convert it to a File
    await Promise.all(
      images.map(async (blobUrl, index) => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const file = new File([blob], `image_${index}.jpg`, {
          type: blob.type,
        });
        formData.append("images", file);
      })
    );

    try {
      let response;
      if (action === "upload") {
        response = await axios.post(
          `${URI}/banners/mainBanner`,
          formData,
          config
        );
      }
      if (action === "edit") {
        const poster = "mainbanner";
        const editId = imageId[currentSlide>0 ? ((currentSlide + 2) / 2)-1 : 0];
        response = await axios.put(
          `${URI}/banners/edit/${editId}/?poster=${poster}`,
          formData,
          config
        );
      }
      if (response.status === 200 || response.status === 201) {
        alert("banners added successfully");
        setContainer1([]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div className="absolute  h-[90%] w-full rounded-md shadow-md  z-20">
      <main className="relative xsm:h-[95%] md:h-full  w-[100%] overflow-auto scrollbar-hidden p-2">
        {imageUpload && (
          <div className="absolute h-full w-full flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
            <div className="relative max-h-max w-[70%] flex flex-col gap-2 border-2 p-4 border-blue-500 bg-white rounded">
              <MdCancel
                className="absolute text-red-500 right-2 top-2 text-lg"
                onClick={() => setImageUpload(!imageUpload)}
              />
              <label className="text-sm">Add Image Container 1</label>
              <div className="relative min-h-32 max-h-max w-full border-2 border-gray-300 rounded p-2 flex items-center gap-2">
                <input
                  id="model"
                  type="file"
                  ref={imageRef_1}
                  {...(action === "upload" && { multiple: true })}
                  className="opacity-0 ml-hidebuttons"
                  onChange={(e) => {
                    handleImageDisplay(e);
                  }}
                />
                <input
                  id="cloth"
                  type="file"
                  ref={imageRef_2}
                  className="opacity-0 ml-hidebuttons"
                  onChange={(e) => {
                    handleImageDisplay(e);
                  }}
                />
                <FiUpload
                  className="sm:w-12 xsm:h-8 sm:h-12 xsm:w-8 cursor-pointer"
                  onClick={() => imageRef_1.current.click()}
                />
                <div className="relative h-full w-[90%]  overflow-auto flex items-center gap-1">
                  {container1.length > 0 &&
                    container1.map((image, index) => (
                      <div className="border-2 border-gray-300 p-2 rounded">
                        <MdCancel
                          id="model"
                          className="text-red-500 right-2 top-2 ml-auto text-lg"
                          onClick={(e) => handleDelete(e, index)}
                        />
                        <div className=" flex gap-2 p-2">
                          <div
                            key={index}
                            className="relative h-16 w-16 flex-shrink-0"
                          >
                            <img
                              src={image[0]}
                              className="h-full w-full rounded border-2 border-gray-500 p-0.5"
                            />
                          </div>
                          <div
                            key={index + 1}
                            className="relative h-16 w-16 flex-shrink-0 rounded flex items-center justify-center"
                          >
                            {image[1] === null ? (
                              <>
                                <p
                                  key={index}
                                  className="absolute text-xs font-bold text-red-500 text-center"
                                  onClick={() => {
                                    setContainer2(index);
                                    imageRef_2.current.click();
                                  }}
                                >
                                  Select apparel
                                </p>
                              </>
                            ) : (
                              <>
                                <img
                                  src={image[1]}
                                  className="h-full w-full rounded border-2 border-gray-500 p-0.5"
                                />
                                <MdDelete
                                  id="apparel"
                                  className="absolute top-1 right-1 text-red-500 cursor-pointer"
                                  onClick={(e) => handleDelete(e, index)}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <button
                className="max-h-max p-2 text-sm text-white mx-auto mt-4 w-16 rounded border-2 border-gray-200 bg-blue-500"
                onClick={handleformsubmission}
              >
                Save
              </button>
            </div>
          </div>
        )}       
        <h1 className="m-2">Main Container</h1>
        <div className="relative w-full flex p-2 aspect-[4/2] rounded shadow-md overflow-auto w-full">
          <div className="relative h-full aspect-[1/1] overflow-y-auto">
            <div className="w-[80%] aspect-[1/1]">
              <img
                src={serverImages[currentSlide]}
                className="w-full h-full object-cover"
                alt={`Banner ${currentSlide + 1} - Image 1`}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[50%] aspect-[1/1] bg-green-300">
              <img
                src={serverImages[(currentSlide + 1) % serverImages.length]}
                className="w-full h-full object-cover"
                alt={`Banner ${currentSlide + 2} - Image 2`}
              />
            </div>
            {serverImages.length > 0 && (
              <div className="absolute top-2 right-2 flex gap-2">
                <MdEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    setAction("edit");
                    setImageUpload(true);

                  }}
                />
                <MdDelete
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleServerImageDelete(slideshowIndex)}
                />
              </div>
            )}
          </div>

          <div className=" right-0 w-[48%] h-full">
            <div className="w-full  h-[50%] flex items-center justify-center">
              <button
                className="max-h-max min-w-max md:p-2 xsm:p-1 rounded border-2 border-gray-200 bg-blue-500 text-white md:text-sm xsm:text-xs"
                onClick={() => {
                  setAction("upload");
                  setImageUpload(!imageUpload);
                }}
              >
                Add Images
              </button>
            </div>
            <div className="w-full h-[50%] flex items-center justify-around">
              <button
                className="max-h-max min-w-max md:p-2 xsm:p-1  rounded border-2 border-gray-200 bg-blue-500 text-white md:text-sm xsm:text-xs"
                onClick={() =>
                  setSlideshowIndex((prev) =>
                    prev + 1 === 0 ? serverImages.length - 1 : prev - 2
                  )
                }
              >
                Previous
              </button>
              <button
                className="max-h-max min-w-max md:p-2 xsm:p-1  md:px-4 xsm:px-2 rounded border-2 border-gray-200 bg-blue-500 text-white  md:text-sm xsm:text-xs"
                onClick={() =>
                  setSlideshowIndex((prev) =>
                    prev + 1 === serverImages.length - 1 ? 0 : prev + 2
                  )
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <ShopByAge />
        <PosterBanner />
      </main>
      <footer className="h-[5%] w-full md:hidden xsm:block">
        <Footer />
      </footer>
    </div>
  );
};

export default AllBanners;
//mmvml
