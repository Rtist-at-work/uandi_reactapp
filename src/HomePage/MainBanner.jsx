import { useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function MainBanner({ banners, loading }) {
  const url = import.meta.env.VITE_API_URL;

  const mainBanners = banners?.filter((b) => b.bannerType === "main") || [];

  const slides = mainBanners.length
    ? [...mainBanners, mainBanners[0]]
    : [];

  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    if (mainBanners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
      setTransition(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [mainBanners.length]);

  useEffect(() => {
    if (current === slides.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 700);
    }
  }, [current, slides.length]);

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
          {slides.map((banner, index) => (
            <div key={index} className="w-full flex-shrink-0">

              <LazyLoadImage
                src={`${url}/api/mediaDownload/${banner.bannerImg}`}
                alt="banner"
                className="w-full h-full object-cover object-right"
              />

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}