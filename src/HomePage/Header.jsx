import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  LogOut,
  Trash2,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { postJsonApi } = useApi();

  const logOut = useCallback(async () => {
    try {
      await postJsonApi("api/logout", "application/json");
    } catch (err) {
      console.log(err);
    }
  }, []);

  // 🔥 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between relative">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">U&I</div>

      {/* Search */}
      <div className="flex items-center w-full max-w-md bg-gray-100 rounded-full px-4 py-2 mx-4">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent w-full outline-none ml-2 text-gray-700"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6 text-gray-700 relative">
        {/* PROFILE DROPDOWN (CLICK) */}
        <div className="relative" ref={dropdownRef}>
          <User
            className="w-6 h-6 cursor-pointer hover:text-black transition"
            onClick={() => setOpen((prev) => !prev)}
          />

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white shadow-xl rounded-xl overflow-hidden z-50 border">
              <ul className="flex flex-col py-2">
                <li
                  onClick={() => {
                    navigate("/my-orders");
                    setOpen(false);
                  }}
                  className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 text-gray-700"
                >
                  <Package className="w-5 h-5" /> My Orders
                </li>

                <li
                  onClick={() => logOut()}
                  className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-100 text-gray-700"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </li>

                {/* <li className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-red-50 text-red-600">
                  <Trash2 className="w-5 h-5" /> Delete Account
                </li> */}
              </ul>
            </div>
          )}
        </div>

        <Heart
          onClick={() => navigate("/wishlist")}
          className="w-6 h-6 cursor-pointer hover:text-black transition"
        />
        <ShoppingCart
          onClick={() => navigate("/cart")}
          className="w-6 h-6 cursor-pointer hover:text-black transition"
        />
      </div>
    </header>
  );
}
