import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const StyleList = ({
  selectedCategory,
  style,
  selectedSub,
  setSelectedSub,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedSub(style);
  }, [style]);

  return (
    <div className="w-full sticky top-8 py-2 z-30 bg-white overflow-x-auto lg:overflow-x-visible scrollbar-hide">
      {selectedCategory && (
        <div className="mt-6">
          <div className="flex gap-3 flex-nowrap lg:flex-wrap min-w-max">
            {selectedCategory.style?.map((sub) => {
              const isSubSelected = selectedSub === sub.style;

              return (
                <button
                  key={sub._id}
                  onClick={() => {
                    setSelectedSub(sub.style);
                    navigate(
                      `/products?category=${selectedCategory?.category}&style=${sub.style}`
                    );
                  }}
                  className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                border flex-shrink-0
                ${
                  isSubSelected
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }
              `}
                >
                  {sub.style}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StyleList;
