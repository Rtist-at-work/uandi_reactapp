import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Resetpassword = () => {
  axios.defaults.withCredentials = true;

  const [password, setPassword] = useState("");
  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    try {
        const res = await axios.put(
            'http://localhost:5000/auth/resetpassword/update',
            null, // No body, just query parameters
            {
              params: {
                newpassword: password,
                token: token,
              },
            }
          );
          
      console.log(res);
      if (res.data.status) {
        console.log(res.data.status);
        alert("password Updated");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-100 py-12">
  <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800">
    Reset Password
  </h2>

  <form
    className="max-w-md md:w-full xsm:w-[90%]  p-8 flex flex-col gap-6 bg-white rounded-lg shadow-lg"
    onSubmit={handleSubmit}
  >
    <label htmlFor="password" className="text-sm sm:text-md font-medium text-gray-700 mb-2">
      New Password:
    </label>
    <input
      type="password"
      placeholder="*******"
      className="h-12 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
      onChange={(e) => setPassword(e.target.value)}
      value={password}
      required
    />
    <button
      type="submit"
      className="h-12 w-full mx-auto sm:w-40 mt-6 rounded-md bg-blue-500 text-white font-semibold transition-all hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      Reset
    </button>
  </form>
</div>

  );
};

export default Resetpassword;
