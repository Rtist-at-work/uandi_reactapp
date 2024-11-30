import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = ({handleCart}) => {
  axios.defaults.withCredentials = true;

  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const categorynav = params.get('categorynav');
  const stylenav = params.get('stylenav');
  const navigation = params.get('pagetype');
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput(emailOrMobile)) {
      alert('Please enter a valid email or mobile number.');
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        emailOrMobile,
        password,
      });
      console.log(res)
  
      if (res.status===200 || res.status===201) {
        if(navigation==="cart"){
          alert(res.data.message); 
          handleCart(e,productDetails,selectedSize)
        }
        else if(navigation==="productpage" && categorynav!==null && stylenav!==null){
          alert(res.data.message); 
          navigate(`/productpage?categorynav=${categorynav}&stylenav=${stylenav}`);     
        }
        else if(res.data.status===true){
          navigate('/')
        }
        else{
          alert(res.data.message); 
        }
      }
    } catch (err) {
      if(axios.isAxiosError(err)){
        if(err.response.status===401){
          alert(err.response.data.message);
        }
        else{
          console.log(err)
        }
      }
    }
  };
  
  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    return emailRegex.test(input) || mobileRegex.test(input);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-100">
  <form
    onSubmit={handleSubmit}
    className="xsm:min-h-max xsm:w-[90%] md:w-[50%] shadow-md border-2 border-gray-300 rounded p-8 bg-white"
  >
    <h2
      className="xsm:text-2xl md:text-3xl font-semibold text-gray-700 mb-6 text-center"
      style={{ fontFamily: "Kabel, sans-serif" }}
    >
      Login
    </h2>
    <div className="flex flex-col gap-4">
      {/* Email or Mobile */}
      <label
        htmlFor="emailOrMobile"
        className="text-md xsm:text-sm text-gray-500"
        style={{ fontFamily: "Kabel, sans-serif" }}
      >
        Email or Mobile:
      </label>
      <input
        type="text"
        id="emailOrMobile"
        autoComplete="off"
        placeholder="Enter your Email or Mobile"
        onChange={(e) => setEmailOrMobile(e.target.value)}
        value={emailOrMobile}
        className="xsm:h-10 md:h-12 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Password */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="password"
          className="text-md xsm:text-sm text-gray-500"
          style={{ fontFamily: "Kabel, sans-serif" }}
        >
          Password:
        </label>
        <Link
          to="/forgotpassword"
          className="underline xsm:text-sm text-blue-500 hover:text-blue-600 transition"
        >
          Forgot password?
        </Link>
      </div>
      <input
        type="password"
        id="password"
        autoComplete="off"
        placeholder="******"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="xsm:h-10 md:h-12 px-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Submit Button */}
      <button
        className="h-10 w-full md:w-32 mx-auto mt-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
        type="submit"
        style={{ fontFamily: "Kabel, sans-serif" }}
      >
        Login
      </button>

      {/* Sign Up Link */}
      <p
        className="text-center text-md xsm:text-sm mt-4"
        style={{ fontFamily: "Kabel, sans-serif" }}
      >
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="underline text-blue-500 hover:text-blue-600 transition"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </form>
</div>

  );
};

export default Login;
