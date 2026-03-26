import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Skeleton } from "@mui/material";

const CartItem = ({ item, updateQty, removeItem, loading }) => {
  if (loading) {
    return (
      <div className="border rounded-xl p-4 flex gap-4 shadow-sm">
        <Skeleton variant="rectangular" width={110} height={110} />
        <div className="flex flex-col justify-between flex-1">
          <Skeleton width="70%" height={25} />
          <Skeleton width="50%" height={20} />
          <div className="flex gap-4 mt-2">
            <Skeleton width={80} height={20} />
            <Skeleton variant="circular" width={20} height={20} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <Skeleton width={60} height={35} />
            <Skeleton width={70} height={20} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 flex gap-4 shadow-sm">
      <LazyLoadImage
        src={item.image}
        alt={item.name}
        className="w-28 h-28 object-cover rounded-xl"
      />

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>

          <div className="flex gap-2 items-center mt-1">
            <p className="text-green-700 font-semibold text-xl">
              ₹{Math.round(item.price)}
            </p>
            {item.originalPrice > item.price && (
              <p className="text-gray-500 line-through">
                ₹{Math.round(item.originalPrice)}
              </p>
            )}
          </div>

          {item.size && (
            <p className="text-sm mt-2">
              Size: <strong>{item.size}</strong>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <select
            value={item.qty}
            onChange={(e) => updateQty(item._id, Number(e.target.value))}
            className="border px-2 py-1 rounded-lg"
          >
            {[1, 2, 3, 4, 5].map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>

          <button
            onClick={() => removeItem(item._id)}
            className="text-red-500 text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
