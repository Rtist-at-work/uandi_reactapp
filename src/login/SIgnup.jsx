import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;
    return emailRegex.test(input) || mobileRegex.test(input);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput(emailOrMobile)) {
      alert('Please enter a valid email or mobile number.');
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/auth/register", {
        username,
        emailOrMobile,
        password,
      });
      console.log(res)
      if (res.data.status) {
        navigate("/login");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      let statusCode;
      if(axios.isAxiosError(err)){
        statusCode = err.response.status ;
      }
      if(statusCode===400){
        console.log(err)
        alert(err.response.data.errors[0].msg)
      }
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
    <form
      className=" max-h-max w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%]  p-8 flex flex-col mt-4 gap-4 rounded-lg shadow-lg bg-white"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-center">SIGN UP</h2>
      
      <label htmlFor="username" className="text-sm sm:text-md font-medium">
        Username:
      </label>
      <input
        type="text"
        className="h-12 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
        placeholder="Username"
        required
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      
      <label htmlFor="emailOrMobile" className="text-sm sm:text-md font-medium">
        Email or Mobile:
      </label>
      <input
        type="text"
        autoComplete="off"
        required
        placeholder="Email or Mobile"
        onChange={(e) => setEmailOrMobile(e.target.value)}
        value={emailOrMobile}
        className="h-12 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
      />
      
      <label htmlFor="password" className="text-sm sm:text-md font-medium">
        Password:
      </label>
      <input
        type="password"
        className="h-12 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
        autoComplete="off"
        required
        placeholder="******"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      
      <button
        type="submit"
        className="h-10 w-full sm:w-48 rounded-md mt-6 mx-auto bg-blue-500 text-white font-semibold transition-all hover:bg-blue-600"
      >
        Sign Up
      </button>
      
      <p className="text-sm sm:text-md mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 font-medium">
          Login
        </Link>
      </p>
    </form>
  </div>
  
  );
};

export default Signup;
