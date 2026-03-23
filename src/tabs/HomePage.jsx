// HomePage.jsx
import Categories from "../HomePage/Categories";
import MainBanner from "../HomePage/MainBanner";
import FeaturedCollections from "../HomePage/FeaturedCollection";
import OffersSection from "../HomePage/OfferSection";
import CategoryHighlights from "../HomePage/CategoryHighlights";
import { StoreHighlights } from "../HomePage/StoreHighlights";
import { BestSellerSection } from "../HomePage/BestSeller";
import useApi from "../hooks/useApi";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
        "application/json"
      );
      if (response.status === 200 || response.status === 201) {
        setCategories(response.data.categories || []);
        setBestSellers(response?.data.bestSellers || []);
      }
      return response;
    } catch (err) {
      console.error("Error fetching categories:", err);
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
      console.log(err);
      return null;
    }
  }, [getJsonApi]);

  useEffect(() => {
    // wrapper so we can async/await
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([getCategory(), getBanners()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const bannerClick = useCallback(
    (productIds) => {
      navigate("/products", {
        state: { productIds },
      });
    },
    [navigate]
  );

  return (
    <div>
      {width >= 1024 && <Categories categories={categories} />}

      <MainBanner
        banners={banners}
        bannerClick={bannerClick}
        loading={loading}
      />

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
      <BestSellerSection bestSellers={bestSellers} loading={loading} />
    </div>
  );
};

export default HomePage;
