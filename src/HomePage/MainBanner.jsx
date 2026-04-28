import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";

export default function MainBanner({ banners, loading }) {
  const url = import.meta.env.VITE_API_URL;

  const mainBanners =
    banners?.filter((b) => b.bannerType === "main") || [];

  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  // Delay slider start → avoids affecting LCP
  useEffect(() => {
    if (mainBanners.length <= 1) return;

    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrent((prev) =>
          prev === mainBanners.length - 1 ? 0 : prev + 1
        );
        setTransition(true);
      }, 4000);

      return () => clearInterval(interval);
    }, 2000); // delay start

    return () => clearTimeout(startDelay);
  }, [mainBanners.length]);

  if (loading) {
    return (
      <div className="w-full aspect-[16/9]">
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>
    );
  }

  if (!mainBanners.length) return null;

  return (
    <div className="w-full overflow-hidden">
      {/* 16:9 Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        {/* Slider */}
        <div
          className={`flex h-full ${
            transition ? "transition-transform duration-700 ease-in-out" : ""
          }`}
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {mainBanners.map((banner, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <img
                src={`${url}/api/mediaDownload/${banner.bannerImg}`}
                alt="banner"
                loading={index === 0 ? "eager" : "lazy"}
                fetchpriority={index === 0 ? "high" : "auto"}
                decoding="async"
                width="1920"
                height="1080"
                className="w-full h-full object-cover object-right"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}