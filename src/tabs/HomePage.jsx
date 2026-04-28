// HomePage.jsx
import useApi from "../hooks/useApi";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { lazy, Suspense } from "react";

import Categories from "../HomePage/Categories";
import MainBanner from "../HomePage/MainBanner";
const FeaturedCollections = lazy(
  () => import("../HomePage/FeaturedCollection"),
);
const OffersSection = lazy(() => import("../HomePage/OfferSection"));
const CategoryHighlights = lazy(() => import("../HomePage/CategoryHighlights"));
const StoreHighlights = lazy(() => import("../HomePage/StoreHighlights"));
const BestSellerSection = lazy(() => import("../HomePage/BestSeller"));

const HomePage = () => {
  const { getJsonApi } = useApi();
  const [categories, setCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories and best sellers
  const getCategory = useCallback(async () => {
    try {
      const response = await getJsonApi(
        "api/getCategories",
        "application/json",
      );
      if (response.status === 200 || response.status === 201) {
        setCategories(response.data.categories || []);
        setBestSellers(response?.data.bestSellers || []);
      }
      return response;
    } catch (err) {
      // console.error("Error fetching categories:", err);
      return null;
    }
  }, [getJsonApi]);

  // Fetch banners
  const getBanners = useCallback(async () => {
    try {
      const response = await getJsonApi("api/getBanner", "application/json");
      setBanners(response?.data.banners || []);
      return response;
    } catch (err) {
      // console.log(err);
      return null;
    }
  }, [getJsonApi]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await getBanners();
      getCategory();

      setLoading(false);
    };

    fetchData();
  }, []);

  const bannerClick = useCallback(
    (productIds) => {
      navigate("/products", {
        state: { productIds },
      });
    },
    [navigate],
  );
  console.log("bs :", bestSellers);
  return (
    <div>
      <div className="hidden lg:block">
        <Categories categories={categories} />
      </div>
      <div id="main-banner">
        <MainBanner
          banners={banners}
          bannerClick={bannerClick}
          loading={loading}
        />
      </div>

      <Suspense fallback={<div>...Loading</div>}>
        <CategoryHighlights categories={categories} loading={loading} />
        <OffersSection
          banners={banners}
          bannerClick={bannerClick}
          loading={loading}
        />
        <StoreHighlights />

        <FeaturedCollections
          banners={banners}
          bannerClick={bannerClick}
          loading={loading}
        />
        {bestSellers.length > 0 && (
          <BestSellerSection bestSellers={bestSellers} loading={loading} />
        )}
      </Suspense>
    </div>
  );
};

export default HomePage;
