import Skeleton from "@mui/material/Skeleton";

const ProductGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border-2 border-gray-200 rounded-2xl p-4">
          <Skeleton variant="rectangular" height={160} className="rounded-xl" />
          <Skeleton height={25} width="80%" className="mt-4" />
          <Skeleton height={25} width="60%" />
          <Skeleton height={30} width="40%" className="mt-4" />
        </div>
      ))}
    </div>
  );
};

export default ProductGridSkeleton;
