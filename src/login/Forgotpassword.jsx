import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineCheckCircle } from "react-icons/ai"; // Importing success icon


const Forgotpassword = () => {

    axios.defaults.withCredentials = true;

    const [email,setEmail] = useState();
    const [popup,setPopup] =useState(false)

    const navigate = useNavigate();

        const handleSubmit = async (e)=> {
            e.preventDefault();
            try{
                const res = await axios.post("http://localhost:5000/auth/forgotpassword",{
                    email,                
                })
                console.log(res)
                if(res.status===200||res.status===201){
                    setPopup(true)
                }
            }
            catch(err){
                console.log(err)
            }
        }


  return (
    <div className="relative w-full h-full flex items-center justify-center">
    <form
      className="max-h-max w-[90%] sm:w-[80%] md:w-[60%] lg:w-[50%] p-8 flex flex-col mt-4 gap-4 rounded-lg shadow-lg bg-white"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-center">Forgot Password</h2>
      
      <label htmlFor="email" className="text-sm sm:text-md font-medium">
        Email:
      </label>
      <input
        type="email"
        className="h-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4"
        autoComplete="off"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      
      <button
        type="submit"
        className="h-10 w-full sm:w-40 rounded-md mt-6 mx-auto bg-blue-500 text-white font-semibold transition-all hover:bg-blue-600"
      >
        Send
      </button>
    </form>
    {popup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white w-[90%] sm:w-96 p-6 rounded-lg shadow-lg">
              {/* Success Icon */}
              <AiOutlineCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              {/* Success Message */}
              <h2 className="text-lg font-bold text-gray-800 text-center">
                Request Submitted Successfully!
              </h2>
              <p className="text-gray-600 text-center text-sm mt-2">
              Reset Link successfully sent to your e-mail
              </p>
              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Go to Login
                </button>
                
              </div>
            </div>
          </div>
        )}

  </div>
  
  )
}

export default Forgotpassword
