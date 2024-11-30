import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const AddressForm = () => {
  axios.defaults.withCredentials = true;
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [landmark, setLandmark] = useState("");
  const [addressType, setAddressType] = useState("");
  const [alternateMobile, setAlternateMobile] = useState("");
  const [pincode, setPincode] = useState("");
  const [pageType, setPageType] = useState();
  const [index, setIndex] = useState(null);
  const [addresses, setAddresses] = useState();

  const navigate = useNavigate();
  const location = useLocation();

  const URI = "http://localhost:5000";

  const getAddress = async (index) => {
    try {
      const response = await axios.get(`${URI}/getAddress`);
      setAddresses(response.data);
      if (index !== null && index >= 0) {
        const address = response.data[index];
        console.log(address);
        setName(address.name || "");
        setMobile(address.mobile || "");
        setLocality(address.locality || "");
        setAddress(address.address || "");
        setCity(address.city || "");
        setState(address.state || "");
        setLandmark(address.landmark || "");
        setAddressType(address.addressType || "");
        setAlternateMobile(address.alternateMobile || "");
        setPincode(address.pincode || "");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const addressIndex = queryParams.get("index");
    const pageTypeFromUrl = queryParams.get("pageType");
    setPageType(pageTypeFromUrl);

    console.log("pageType:", pageTypeFromUrl); // Check if pageType is retrieved correctly

    if (addressIndex !== null) {
      setIndex(parseInt(addressIndex, 10));
    }
    getAddress(parseInt(addressIndex, 10));
  }, [location]);

  const handleFormData = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "name":
        setName(value);
        break;
      case "mobile":
        setMobile(value);
        break;
      case "locality":
        setLocality(value);
        break;
      case "address":
        setAddress(value);
        break;
      case "city":
        setCity(value);
        break;
      case "state":
        setState(value);
        break;
      case "landmark":
        setLandmark(value);
        break;
      case "home":
      case "work":
        setAddressType(e.target.value);
        break;
      case "alternateMobile":
        setAlternateMobile(value);
        break;
      case "pincode":
        setPincode(value);
        break;
      default:
        break;
    }
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !locality ||
      !address ||
      !city ||
      !state ||
      !landmark ||
      !addressType ||
      !pincode
    ) {
      return alert("Please fill all fields.");
    }

    if (!/^\d{10}$/.test(mobile) || !/^\d{10}$/.test(alternateMobile)) {
      return alert("Please enter valid 10-digit mobile numbers.");
    }

    const formData = {
      name,
      mobile,
      locality,
      address,
      city,
      state,
      landmark,
      addressType,
      alternateMobile,
      pincode,
    };
    const updated = [...addresses];
    updated[index] = formData;
    try {
      if (index !== null && index !== undefined) {
        const response = await axios.put(`${URI}/update/address/`, updated);
        if (response.status === 200 || response.status === 201) {
          console.log("Updated address successfully");

          // Reset fields after update
          resetForm();

          // Check and navigate based on pageType
          if (pageType) {
            navigate(`/${pageType}`);
          } else {
            navigate("/deliveryaddress"); // Fallback in case of invalid pageType
          }
        }
      } else {
        const response = await axios.post(`${URI}/auth/address`, formData);
        if (response.status === 200 || response.status === 201) {
          console.log("Added new address successfully");

          // Reset fields after adding
          resetForm();

          // Check and navigate based on pageType
          if (pageType) {
            navigate(`/${pageType}`);
          } else {
            navigate("/deliveryaddress");
          }
        }
      }
    } catch (error) {
      console.log(error.response || error.message);
    }
  };

  const resetForm = () => {
    setName("");
    setMobile("");
    setLocality("");
    setAddress("");
    setCity("");
    setState("");
    setLandmark("");
    setAddressType("");
    setAlternateMobile("");
    setPincode("");
  };

  return (
    <div className="h-screen w-screen ">
      <Header />
      <main className="relative h-[85%] w-full overflow-y-auto scrollbar-hidden">
        <h1 className="font-semibold text-lg p-2 text-blue-500 m-8">
          Delivery Address 
        </h1>
        <form className="max-h-max w-[75%] mx-auto shadow-md p-4 flex flex-col gap-2 mb-8">
          <label className="block text-lg font-medium text-gray-700 ">
            Name
          </label>
          <input
            id="name"
            maxLength={20}
            value={name}
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="Name"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700">
            Mobile
          </label>
          <input
            id="mobile"
            value={mobile}
            maxLength="10"
            pattern="\d{10}"
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="Mobile"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500  mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            Locality
          </label>
          <input
            id="locality"
            value={locality}
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="Locality"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            Address (Area and Street)
          </label>
          <input
            id="address"
            value={address}
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="Address (Area and Street)"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            City/District/Town
          </label>
          <input
            id="city"
            value={city}
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="City/District/Town"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            Pin-code
          </label>
          <input
            id="pincode"
            value={pincode}
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="Pin-code"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            State
          </label>
          <input
            id="state"
            value={state}
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="State"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            Landmark (Optional)
          </label>
          <input
            id="landmark"
            value={landmark}
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="Landmark"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            Alternate Phone Number
          </label>
          <input
            id="alternateMobile"
            value={alternateMobile}
            maxLength="10"
            pattern="\d{10}"
            required
            onChange={(e) => handleFormData(e)}
            type="text"
            placeholder="Alternate Phone Number"
            className="h-12 w-full px-2 border-2 border-gray-300 rounded outline-blue-500 mb-2"
          />

          <label className="block text-lg font-medium text-gray-700 ">
            Address Type
          </label>
          <div className="flex flex-col space-y-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                id="home"
                value="Home"
                checked={addressType === "Home"}
                onChange={(e) => handleFormData(e)}
                required
                type="radio"
                className="form-radio text-blue-600 mb-2"
                name="addressType"
              />
              <span className="text-gray-800">Home</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                id="work"
                value="Work"
                checked={addressType === "Work"}
                onChange={(e) => handleFormData(e)}
                required
                type="radio"
                className="form-radio text-blue-600 mb-2"
                name="addressType"
              />
              <span className="text-gray-800">Work</span>
            </label>
          </div>

          <button
            type="submit"
            onClick={(e) => {
              handleSubmission(e);
            }}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 max-w-max max-h-max px-8 mx-auto"
          >
            Save
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddressForm;
