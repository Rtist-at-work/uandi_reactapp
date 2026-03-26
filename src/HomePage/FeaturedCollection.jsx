import Skeleton from "@mui/material/Skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function FeaturedCollections({ banners, bannerClick, loading }) {
  const apiBase = import.meta.env.VITE_API_URL;
  const featured = banners.filter((b) => b.bannerType === "featured");

  return (
    <div className="w-full px-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Featured Collections
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative w-full h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-md"
              >
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </div>
            ))
          : featured.map((item) => {
              const imgSrc = `${apiBase}/api/mediaDownload/${item.bannerImg}`;

              return (
                <div
                  key={item._id}
                  onClick={() => bannerClick(item.products)}
                  className="relative w-full h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-md cursor-pointer group"
                >
                  <LazyLoadImage
                    src={imgSrc}
                    alt={item.heading}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />

                  <div className="absolute inset-0 bg-black/40 flex items-end p-3 text-white font-semibold text-sm sm:text-base">
                    {item.heading}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
