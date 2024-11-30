import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBorderAll } from "react-icons/fa";
import { GoHeart } from "react-icons/go";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const ProfilePage = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    gender: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
  });
  const [reset, setReset] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(true);

  const navigate = useNavigate();

  const [updateId, setUpdateId] = useState();

  const userDetails = async () => {
    try {
      const response = await axios.get(`${URI}/profile/getUser`, { withCredentials: true });

      console.log(response)
      if (response.status === 200 || response.status === 201) {
        setUpdateId(response.data._id);
        setPersonalInfo({
          name: response.data.personalInfo.name,
          email: response.data.personalInfo.email,
          mobile: response.data.personalInfo.mobile,
          username: response.data.personalInfo.username,
          gender: response.data.personalInfo.gender,
          password: response.data.personalInfo.password,
        });
        setLogin(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 401) {
          setLogin(false);
        }
      } else {
        alert("unkonwn error occured please try again later");
      }
    }
  };
  useEffect(() => {
    userDetails();
  }, []);
  // Handle input changes for all fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (value === "Male") setPersonalInfo({ ...personalInfo, gender: value });
    else if (value === "Female")
      setPersonalInfo({ ...personalInfo, gender: value });
    else if (value === "Transgender")
      setPersonalInfo({ ...personalInfo, gender: value });
    else if (id === "mobile")
      setPersonalInfo({ ...personalInfo, mobile: value });
    else if (id === "email") setPersonalInfo({ ...personalInfo, email: value });
    else if (id === "username")
      setPersonalInfo({ ...personalInfo, username: value });
    else if (id === "name") setPersonalInfo({ ...personalInfo, name: value });
  };

  const handleUpdate = async () => {
    if (
      !personalInfo.name ||
      !personalInfo.email ||
      !personalInfo.mobile ||
      !personalInfo.username ||
      !personalInfo.gender
    ) {
      return alert("please fill the empty fields");
    }
    try {
      const response = await axios.post(
        `${URI}/profile/update/${updateId}`,
        personalInfo
      );
      if (response.status === 200 || response.status === 201) {
        alert("Details updated successfully");
        setPersonalInfo(personalInfo);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.status === 401) {
          alert("user not found please login");
        }
      } else {
        alert("unkonwn error occured please try again later");
      }
    }
  };

  const handleNavigate = () => {
    navigate(`/deliveryaddress/?username=${updateId}`);
  };

  const handlePasswordReset = () => {
    setReset(true);
  };
  const handlePasswordCheck = async () => {
    try {
      const response = await axios.get(
        `${URI}/auth/resetpassword/check/?password=${password}`,
        { withCredentials: true } // Ensure cookies are sent
      );
      if (response.status === 200 || response.status === 201) {
        setPasswordSuccess(!passwordSuccess);
        setPassword("");
        setReset(!reset);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  const handlePasswordUpdate = async () => {
    try {
      const response = await axios.put(
        `${URI}/auth/resetpassword/update/?newpassword=${newPassword}`,
        { withCredentials: true } // Ensure cookies are sent
      );
      if (response.status === 200 || response.status === 201) {
        setPasswordSuccess(!passwordSuccess);
        setNewPassword("");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <Header />
      <main className="h-[85%] w-full overflow-y-auto scrollbar-hidden md:p-8 xsm:p-2 mb-8">
        {login ? (
          <>
            <div className="h-[30%] w-full p-2 flex flex-wrap items-center justify-around gap-2">
              <div
                className="border-2 border-gray-300 h-[40%] w-[40%] p-2 rounded flex items-center justify-center gap-2 hover:shadow-md cursor-pointer"
                onClick={() => {
                  navigate("/whishlist");
                }}
              >
                <GoHeart /> Whishlist
              </div>
              <div
                className="border-2 border-gray-300 h-[40%] w-[40%] p-2 rounded flex items-center justify-center gap-2 hover:shadow-md cursor-pointer"
                onClick={() => {
                  navigate("/userorders");
                }}
              >
                <FaBorderAll /> Orders
              </div>
            </div>
            <div className=" w-full max-h-max flex flex-col md:flex-row gap-6 p-4 overflow-auto">
              {/* Form Section */}
              <form className="w-full md:w-[50%] flex flex-col gap-6 mb-8 bg-white shadow-md rounded-lg p-6 flex-1">
                {/* Mobile Number */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 text-sm">Mobile Number</label>
                  <div className="border-b-2 border-gray-300 flex items-center justify-between">
                    <input
                      type="number"
                      id="mobile"
                      value={personalInfo.mobile}
                      onChange={handleChange}
                      onWheel={(e) => e.target.blur()}
                      className="w-full outline-none py-1 text-gray-700"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 text-sm">E-mail</label>
                  <div className="border-b-2 border-gray-300 flex items-center justify-between">
                    <input
                      type="text"
                      id="email"
                      value={personalInfo.email}
                      onChange={handleChange}
                      className="outline-none w-full py-1 text-gray-700"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 text-sm">User Name</label>
                  <div className="border-b-2 border-gray-300 flex items-center justify-between">
                    <input
                      type="text"
                      id="username"
                      value={personalInfo.username}
                      onChange={handleChange}
                      className="outline-none w-full py-1 text-gray-700"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 text-sm">Name</label>
                  <div className="border-b-2 border-gray-300 flex items-center justify-between">
                    <input
                      type="text"
                      id="name"
                      value={personalInfo.name}
                      onChange={handleChange}
                      className="outline-none w-full py-1 text-gray-700"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-500 text-sm">Gender</label>
                  <div className="border-b-2 border-gray-300 flex items-center justify-between">
                    <select
                      id="gender"
                      value={personalInfo.gender}
                      onChange={handleChange}
                      className="outline-none w-full py-1 text-gray-700 bg-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="mx-auto max-h-max max-w-max px-4 py-2 mt-8 text-white font-semibold bg-blue-500 hover:shadow-md rounded"
                  >
                    Update
                  </button>
                </div>
              </form>

              {/* Right Section */}
              <div className="w-full md:w-[50%] bg-white shadow-md rounded-lg p-6 flex-1">
                {/* Delivery Address */}
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={handleNavigate}
                >
                  <span className="text-gray-700">Delivery Address</span>
                  <MdOutlineKeyboardArrowRight className="text-gray-500" />
                </div>
                <hr className="my-2" />

                {/* Password Reset */}
                <div
                  className="flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={handlePasswordReset}
                >
                  <span className="text-gray-700">Password Reset</span>
                  <MdOutlineKeyboardArrowRight className="text-gray-500" />
                </div>
                <hr className="my-2" />
              </div>
            </div>

            {reset && (
              <div className="absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col gap-4">
                  <h2 className="text-lg font-semibold">Reset Password</h2>
                  <input
                    type="password"
                    placeholder="Enter Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setPassword("");
                        setReset(false);
                      }} // Close the popup
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={handlePasswordCheck} // Submit password
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
            {passwordSuccess && (
              <div className="absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] flex flex-col gap-4">
                  <h2 className="text-lg font-semibold">New Password</h2>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setNewPassword("");
                        setPasswordSuccess(false);
                      }} // Close the popup
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={handlePasswordUpdate} // Submit password
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center min-h-full">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md text-center border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                No Orders Found
              </h2>
              <p className="text-gray-600 mb-6">
                Please login to view your orders.
              </p>
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
