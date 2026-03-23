import { useState, useCallback } from "react";
import { Star, Heart } from "lucide-react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { postJsonApi } = useApi();

  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted);

  // Wishlist Handler - Optimistic UI
  const toggleWishlist = useCallback(
    async (productId) => {
      try {
        setIsWishlisted((prev) => !prev);

        const response = await postJsonApi(
          "api/postWishlist",
          { productId },
          "application/json"
        );

        if (!(response?.status === 200 || response?.status === 201)) {
          setIsWishlisted((prev) => !prev);
        }
      } catch (err) {
        console.error("Wishlist Error:", err);
        setIsWishlisted((prev) => !prev);
      }
    },
    [postJsonApi]
  );

  // Price Calculation
  const getFinalPrice = (prod) => {
    if (prod.offertype === "flat")
      return Math.round(Math.max(prod.price - prod.offer, 0));

    if (prod.offertype === "percentage")
      return Math.round(
        Math.max(prod.price - (prod.price * prod.offer) / 100, 0)
      );

    return Math.round(prod.price);
  };

  const finalPrice = getFinalPrice(product);
  const hasOffer = finalPrice !== product.price;
  const reviewCount = product.reviews?.length || 0;

  return (
    <div
      onClick={() => navigate(`/product/?id=${product._id}`)}
      className="group relative bg-white border-2 border-gray-200 cursor-pointer rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 p-4 flex flex-col justify-between h-full"
    >
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product._id);
        }}
        className="absolute top-6 right-6 z-10"
      >
        <Heart
          size={22}
          className={`transition-all ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Image */}
      <div className="w-full h-40 overflow-hidden rounded-xl">
        <img
          src={`${url}/api/mediaDownload/${product.productImages[0]}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-gray-600 mt-3 text-sm sm:text-base break-words"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "3rem",
        }}
      >
        {product.name}
      </h3>

      <div className="flex-1"></div>

      {/* Price */}
      <div className="flex flex-col gap-1 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-800">₹{finalPrice}</span>

          {hasOffer && (
            <span className="text-sm line-through text-gray-500">
              ₹{product.price}
            </span>
          )}
        </div>

        {hasOffer && (
          <span className="text-xs font-medium text-green-600">
            {product.offertype === "percentage"
              ? `${product.offer}% OFF`
              : `₹${product.offer} OFF`}
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        <Star size={16} className="text-yellow-500 fill-yellow-500" />
        <span className="text-sm text-gray-800">
          {product.averageRating?.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500">({reviewCount})</span>
      </div>
    </div>
  );
};

export default ProductCard;
