import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, ShieldCheck, X } from "lucide-react";
import useApi from "../hooks/useApi";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";

export default function AuthPopup({ isOpen, onClose }) {
  const [step, setStep] = useState("login");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added

  const { setAuthCardPopUp } = useAppContext();
  const { postJsonApi } = useApi();

  const auth = async () => {
    // const api = step === "login" ? "api/send-otp" : "api/verify-otp";
    // const data = step === "login" ? { email } : { otp, email };

    try {
      setLoading(true); // ✅ start loading

      const response = await postJsonApi('api/send-otp', { email }, "application/json");

      if (response?.status === 200) {
        // if (step === "login") {
        //   setStep("otp");
        // } else {
          const user = response.data?.user || {};
          localStorage.setItem("username", user.name || "User");
          localStorage.setItem("email", email);

          setAuthCardPopUp(false);
          setMobile("");
          setEmail("");
          setOtp("");
        // }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const handleSendOtp = () => {
    // if (step === "login") {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    // } else if (step === "otp") {
    //   if (!otp || otp.length !== 6) {
    //     toast.error("Please enter the 6-digit OTP");
    //     return;
    //   }
    // }
    auth();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <X size={22} className="text-gray-600" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-700 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md">
            <ShieldCheck size={38} />
          </div>
          <h2 className="text-2xl font-semibold mt-3">
            {step === "signup" ? "Create an Account" : "Welcome Back"}
          </h2>
          {/* <p className="text-gray-500 text-sm">
            {step === "signup"
              ? "Sign up with your mobile number"
              : "Login using OTP"}
          </p> */}
        </div>

        {step !== "otp" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <div className="flex items-center border rounded-xl p-3 gap-2 bg-gray-50">
              <span className="text-gray-500">@</span>
              <div className="w-px h-6 bg-gray-300" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none"
                placeholder="Enter your email address"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading} // ✅ disable
              className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800 text-white"
              }`}
            >
              {loading ? "Logging In..." : "Login"} {/* ✅ text change */}
            </button>

            {/* <div className="text-center mt-5 text-sm text-gray-600">
              {step === "login" ? (
                <p>
                  New user?
                  <button
                    onClick={() => setStep("signup")}
                    className="text-blue-700 ml-1 font-medium hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?
                  <button
                    onClick={() => setStep("login")}
                    className="text-blue-700 ml-1 font-medium hover:underline"
                  >
                    Login
                  </button>
                </p>
              )}
            </div> */}
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block font-medium text-gray-700 mb-2">
              Enter OTP
            </label>
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value.slice(0, 6))}
              className="w-full border p-3 rounded-xl bg-gray-50 outline-none tracking-widest text-center text-lg"
              placeholder="6-digit OTP"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading} // ✅ disable
              className={`w-full mt-6 py-3 rounded-xl font-semibold transition ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"} {/* ✅ text change */}
            </button>

            <button
              onClick={() => setStep("login")}
              className="w-full mt-3 text-blue-700 font-medium hover:underline"
            >
              Change Email
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}