import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/useApi";
import { Skeleton } from "@mui/material";
import { toast } from "sonner";

const ProductDetail = ({ product }) => {
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const images = product.productImages || [];

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const [addLoading, setAddLoading] = useState(false);
  const [buyLoading, setBuyLoading] = useState(false);

  const { postJsonApi } = useApi();

  // Select size
  const handleSelectSize = (size) => setSelectedSize(size);

  // Add product to cart
  const addCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    setAddLoading(true);
    try {
      await postJsonApi(
        "api/addCart",
        { productId: product._id, size: selectedSize, quantity },
        "application/json"
      );
    } catch (err) {
      console.log("Add to Cart Error:", err);
      toast.error("Failed to add product to cart");
    } finally {
      setAddLoading(false);
    }
  };

  // Buy Now: add to cart then navigate
  const handleBuyNow = async () => {
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }

    setBuyLoading(true);
    try {
      await postJsonApi(
        "api/addCart",
        { productId: product._id, size: selectedSize, quantity },
        "application/json"
      );
      navigate("/cart");
    } catch (err) {
      console.log("Buy Now Error:", err);
      toast.error("Failed to add product to cart");
    } finally {
      setBuyLoading(false);
    }
  };

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
      setTimeout(() => setLoading(false), 500);
    }
  }, [images]);

  // Calculate final price with offer
  let finalPrice = product.price;
  if (product.offer > 0) {
    finalPrice =
      product.offertype === "percentage"
        ? Math.round(product.price - (product.price * product.offer) / 100)
        : Math.round(product.price - product.offer);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* LEFT: Images */}
      <div>
        {loading ? (
          <Skeleton variant="rectangular" height={450} />
        ) : (
          <div className="w-full border border-gray-300 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
            <img
              src={`${url}/api/mediaDownload/${selectedImage}`}
              className="w-full h-[450px] object-contain"
            />
          </div>
        )}

        <div className="flex gap-4 mt-4 overflow-x-auto">
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" width={80} height={80} />
              ))
            : images.map((img, index) => (
                <div
                  key={index}
                  className={`border rounded-xl bg-gray-100 cursor-pointer overflow-hidden ${
                    selectedImage === img
                      ? "border-4 border-blue-400"
                      : "border-2 border-gray-400"
                  }`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={`${url}/api/mediaDownload/${img}`}
                    className="w-20 h-20 object-contain"
                  />
                </div>
              ))}
        </div>
      </div>

      {/* RIGHT SIDE: Details */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <>
            <Skeleton width="60%" height={40} />
            <Skeleton width="30%" height={30} />
            <Skeleton width="40%" height={30} />
            <Skeleton width="50%" height={40} />
            <Skeleton width="80%" height={80} />
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold">{product.name}</h1>

            <p className="text-gray-500 text-lg">
              Category: <span className="font-semibold">{product.category}</span>
            </p>

            <p className="text-gray-500 text-lg">
              Style: <span className="font-semibold">{product.style}</span>
            </p>

            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="font-semibold">{product.averageRating || 0}</span>
              <span className="text-gray-500">
                ({product.reviews?.length || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mt-2">
              <p className="text-3xl font-bold text-green-700">₹{finalPrice}</p>
              {product.offer > 0 && (
                <>
                  <p className="text-gray-500 line-through text-lg">₹{product.price}</p>
                  <span className="text-red-600 font-semibold text-lg">
                    {product.offertype === "percentage"
                      ? `${product.offer}% off`
                      : `₹${product.offer} off`}
                  </span>
                </>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Select Size:</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      className={`px-4 py-2 border rounded-xl ${
                        selectedSize === size.size
                          ? "bg-black text-white "
                          : "bg-white text-gray-700 border-gray-300"
                      } hover:bg-gray-900 hover:text-white`}
                      onClick={() => handleSelectSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mt-4">
              <p className="font-semibold">Quantity:</p>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="px-6 text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART + BUY NOW */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={addCart}
                disabled={addLoading}
                className="px-6 py-3 min-w-[140px] bg-black text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {addLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Add to Cart"
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={buyLoading}
                className="px-6 py-3 min-w-[140px] border rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {buyLoading ? (
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Buy Now"
                )}
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-4">
              Product ID: {product?.productId}
            </p>

            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
