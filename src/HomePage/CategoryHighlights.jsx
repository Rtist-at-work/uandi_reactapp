// CategoryHighlights.jsx
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useNavigate } from "react-router-dom";

const CategoryHighlights = ({ categories, loading }) => {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleNavigate = (cat) => {
    // some categories might not have style array - guard it
    const style = cat?.style?.[0]?.style || "";
    navigate(`/products?category=${encodeURIComponent(cat.category)}&style=${encodeURIComponent(style)}`);
  };

  // number of skeleton items to show
  const skeletonCount = 6;

  return (
    <div className="w-full mt-6 px-4 sm:px-6">
      <h2 className="text-xl font-bold mb-4">Shop by Category</h2>

      {/* MOBILE → horizontal slider */}
      <div className="block md:hidden">
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-36 text-center">
                  <div className="w-36 h-36 rounded-full overflow-hidden shadow-md">
                    <Skeleton variant="circular" width={144} height={144} />
                  </div>
                  <div className="mt-3">
                    <Skeleton variant="text" width={80} height={18} />
                  </div>
                </div>
              ))
            : categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => handleNavigate(cat)}
                  className="flex-shrink-0 w-36 text-center cursor-pointer"
                >
                  <div className="w-36 h-36 rounded-full overflow-hidden shadow-md">
                    <img
                      src={`${url}/api/mediaDownload/${cat.posters[0]}`}
                      alt={cat.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="mt-3 font-semibold text-gray-800 text-sm">
                    {cat.category}
                  </p>
                </div>
              ))}
        </div>
      </div>

      {/* DESKTOP → 4 column grid */}
      <div className="hidden md:grid grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-40 h-40 xl:w-52 xl:h-52 rounded-full overflow-hidden shadow-md">
                  <Skeleton variant="circular" width={208} height={208} />
                </div>
                <div className="mt-3 w-32">
                  <Skeleton variant="text" width="100%" height={20} />
                </div>
              </div>
            ))
          : categories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => handleNavigate(cat)}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="w-40 h-40 xl:w-52 xl:h-52 rounded-full overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={`${url}/api/mediaDownload/${cat.posters[0]}`}
                    alt={cat.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="mt-3 font-semibold text-gray-800 text-base">
                  {cat.category}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default CategoryHighlights;
