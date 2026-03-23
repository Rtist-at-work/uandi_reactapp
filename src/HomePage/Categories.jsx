import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Categories({ categories }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0 });
  const [closeTimeout, setCloseTimeout] = useState(null);

  const navigate = useNavigate();
  const visibleCategories = categories.slice(0, 5);

  const openDropdown = (event, index) => {
    if (closeTimeout) clearTimeout(closeTimeout);

    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ left: rect.left });
    setHoveredCategory(index);
  };

  const delayedClose = () => {
    const timeout = setTimeout(() => setHoveredCategory(null), 150);
    setCloseTimeout(timeout);
  };

  return (
    <div className="relative w-full z-40 sticky top-0">
      {/* CATEGORY BAR */}
      <div className="bg-gray-100 py-3 px-6 shadow-sm h-12 flex items-center gap-6">
        <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto scrollbar-hide">
          {visibleCategories.map((cat, index) => (
            <button
              key={index}
              onMouseEnter={(e) => openDropdown(e, index)}
              onMouseLeave={delayedClose}
              className="text-gray-700 hover:text-black font-medium transition cursor-pointer"
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* DROPDOWN */}
      {hoveredCategory !== null && (
        <div
          className="absolute top-12 bg-white shadow-xl border rounded-lg py-3 px-4 w-48 z-[9999]"
          style={{ left: dropdownPosition.left }}
          onMouseEnter={() => clearTimeout(closeTimeout)}
          onMouseLeave={delayedClose}
        >
          {visibleCategories[hoveredCategory]?.style?.length > 0 ? (
            visibleCategories[hoveredCategory].style.map((item) => (
              <p
                key={item._id}
                className="py-2 px-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                onClick={() =>
                  navigate(
                    `/products?category=${visibleCategories[hoveredCategory].category}&style=${item.style}`
                  )
                }
              >
                {item.style}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">No styles</p>
          )}
        </div>
      )}
    </div>
  );
}
