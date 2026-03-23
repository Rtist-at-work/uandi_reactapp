import { useState, useEffect, useCallback } from "react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import ProductGridSkeleton from "../components/ProductGridSkeletn";
import Breadcrumb from "../components/BreadCrumb";

const Wishlist = () => {
  const { getJsonApi, postJsonApi } = useApi();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getProducts = useCallback(async () => {
    try {
      const response = await getJsonApi("api/getwishlist", "application/json");

      if (response?.status === 200) {
        setWishlist(response.data.products);
      }
    } catch (err) {
      console.log("Wishlist Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  // ⭐ Remove wishlist item (toggle)
  const removeWishlist = useCallback(
    async (productId) => {
      try {
        const response = await postJsonApi(
          "api/postWishlist",
          { productId },
          "application/json"
        );

        if (response?.status === 200 || response?.status === 201) {
          setWishlist((prev) => prev.filter((item) => item._id !== productId));
        }
      } catch (err) {
        console.error("Remove wishlist error:", err);
      }
    },
    [postJsonApi]
  );

  // ⭐ Material UI Skeleton Loader
  if (loading)
    return (
      <ProductGridSkeleton/>
    );

  return (
    <div className="p-4">
      <Breadcrumb/>
      <h2 className="text-xl font-semibold mb-4">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty ❤️</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow-sm p-3 cursor-pointer hover:shadow-md transition"
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/api/mediaDownload/${
                  product.productImages?.[0]
                }`}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
                onClick={() => navigate(`/product/?id=${product._id}`)}
              />

              <h3 className="mt-2 text-sm font-medium">{product.name}</h3>

              <p className="text-gray-700 font-semibold mt-1">
                ₹{product.price}
              </p>

              <p className="text-xs text-gray-500">{product.category}</p>

              <p className="text-yellow-600 text-sm">⭐ {product.averageRating || 0}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeWishlist(product._id);
                }}
                className="mt-2 text-red-500 text-sm underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
