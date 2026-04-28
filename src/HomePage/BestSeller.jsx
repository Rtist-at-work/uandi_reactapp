import Skeleton from "@mui/material/Skeleton";
import ProductCard from "../components/ProductCard";

const BestSellerSection = ({ bestSellers, loading }) => {
  console.log('bs :', bestSellers)
  return (
    <div className="w-full mt-12 px-6">
      <h2 className="text-xl font-bold mb-6">Best Sellers</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full">
                <Skeleton variant="rectangular" height={220} />
                <Skeleton variant="text" width={"80%"} />
                <Skeleton variant="text" width={"60%"} />
              </div>
            ))
          : bestSellers.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
      </div>
    </div>
  );
};

export default BestSellerSection
