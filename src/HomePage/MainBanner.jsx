// MainBanner.jsx
import Skeleton from "@mui/material/Skeleton";

export default function MainBanner({ banners, bannerClick, loading }) {
  const url = import.meta.env.VITE_API_URL;
  
  // Filter only MAIN type
  const mainBanner = banners?.find((b) => b.bannerType === "main");

  // Show skeleton while loading
  if (loading) {
    return (
      <div className="w-full">
        <div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden shadow-lg">
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </div>
      </div>
    );
  }

  if (!mainBanner) return null; // No main banner

  return (
    <div className="w-full">
      <div className="relative w-full h-60 sm:h-72 md:h-96 overflow-hidden shadow-lg">
        <img
          src={`${url}/api/mediaDownload/${mainBanner.bannerImg}`}
          alt={mainBanner.heading}
          className="w-full h-full object-cover"
        />

        {/* Banner Content */}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            {mainBanner.heading}
          </h1>
          <p className="text-sm md:text-lg mb-4">{mainBanner.subHeading}</p>

          <button onClick={()=>bannerClick(mainBanner?.products)} className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
