import React from "react";
import Slider from "@mui/material/Slider";

const ProductFilter = ({
  filterData,
  selectedSizes,
  setSelectedSizes,
  priceRange,
  setPriceRange,
  selectedRating,
  setSelectedRating,
  resetFilter,
}) => {

  // Original array
  const sizesData = filterData?.sizes || [];

  // Extract unique size values
  const sizes = [...new Set(sizesData.map((item) => item.size))];


  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  return (
    <div className="w-64 p-4  bg-white rounded-xl shadow-md border sticky top-28 h-fit">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* PRICE FILTER */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Price Range</h3>

        <Slider
          value={priceRange}
          onChange={(e, val) => setPriceRange(val)}
          valueLabelDisplay="auto"
          min={100}
          max={filterData?.highestPrice || 3000}
        />

        <p className="text-sm mt-1 text-gray-600">
          ₹ {priceRange[0]} – ₹ {priceRange[1]}
        </p>
      </div>

      {/* SIZE FILTER */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {sizes?.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 rounded-lg border text-sm cursor-pointer
                ${
                  selectedSizes.includes(size)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 border-gray-300"
                }
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* RATING FILTER */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Rating</h3>

        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedRating === r}
                onChange={() => setSelectedRating(r)}
              />
              <span>{r} ★ & up</span>
            </label>
          ))}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={selectedRating === 0}
              onChange={() => setSelectedRating(0)}
            />
            <span>All Ratings</span>
          </label>
        </div>
      </div>

      {/* RESET BUTTON */}
      <button
        onClick={resetFilter}
        className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg text-sm"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default ProductFilter;
