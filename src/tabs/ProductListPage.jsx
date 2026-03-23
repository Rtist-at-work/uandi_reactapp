import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import StyleList from "../ProductListPage/StyleList";
import ProductFilter from "../ProductListPage/ProductFilter";
import Categories from "../HomePage/Categories";
import ProductCard from "../components/ProductCard";
import ProductGridSkeleton from "../components/ProductGridSkeletn";
import useApi from "../hooks/useApi";
import Breadcrumb from "../components/BreadCrumb";

const ProductListPage = () => {
  const [selectedCategory, setSelectedCategory] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterData, setFilterData] = useState({});

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([100, 3000]);
  const [selectedRating, setSelectedRating] = useState(0);

  const [loading, setLoading] = useState(true);

  const { getJsonApi } = useApi();
  const { search, state } = useLocation();

  const params = new URLSearchParams(search);
  const category = params.get("category");
  const style = params.get("style");
  const productIds = state?.productIds || [];

  /* ------------------ SCROLL TO TOP ------------------ */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [category, style, productIds]);

  /* ------------------ FETCH PRODUCTS ------------------ */
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getJsonApi(
        `api/getCategoryProducts?selectedCategory=${category}&style=${
          style || ""
        }&productIds=${productIds}`,
        "application/json"
      );
      if (response.status === 200 || response.status === 201) {
        const prods = response.data.products || [];

        setAllProducts(prods);
        setProducts(prods);

        setFilterData({
          sizes: response.data.sizes || [],
          highestPrice: response.data.highestPrice || 3000,
        });

        setPriceRange([100, response.data.highestPrice || 3000]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [category, style]);

  // fetch category

  const getCategory = useCallback(async () => {
    try {
      const response = await getJsonApi(
        "api/getCategories",
        "application/json"
      );
      if (response.status === 200 || response.status === 201) {
        setCategoryList(response.data.categories || []);
        setSelectedCategory(
          response.data.categories.find((c) => c.category === category)
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, [getJsonApi, category]);

  /* ------------------ INITIAL LOAD ------------------ */
  useEffect(() => {
    getCategory();
    getProducts();
  }, [category, style]);

  /* ------------------ RESET FILTER ------------------ */
  const resetFilter = () => {
    setSelectedSizes([]);
    setSelectedRating(0);
    setPriceRange([100, filterData?.highestPrice || 3000]);
    setProducts(allProducts);
  };

  /* ------------------ APPLY FILTER ------------------ */
  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes?.some((s) => selectedSizes.includes(s.size))
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedRating > 0) {
      filtered = filtered.filter((p) => {
        const avg =
          p.reviews?.length > 0
            ? p.reviews.reduce((a, b) => a + b.rating, 0) / p.reviews.length
            : 0;
        return avg >= selectedRating;
      });
    }

    setProducts(filtered);
  }, [selectedSizes, priceRange, selectedRating, allProducts]);

  /* ------------------ LOCK BODY SCROLL ------------------ */
  useEffect(() => {
    document.body.style.overflow = isFilterOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isFilterOpen]);

  return (
    <div>
      <Breadcrumb />
      <Categories categories={categoryList} />

      <div className="p-4 pb-16">
        <StyleList
          categories={categoryList}
          selectedCategory={selectedCategory}
          selectedSub={selectedSub}
          setSelectedSub={setSelectedSub}
          style={style}
          onSelect={setSelectedCategory}
        />

        <div className="relative flex gap-6 mt-8">
          {/* MOBILE FILTER BUTTON */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-xl active:scale-95 transition"
          >
            <SlidersHorizontal size={22} />
          </button>

          {/* DESKTOP FILTER */}
          <div className="hidden lg:block w-64">
            <ProductFilter
              filterData={filterData}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              resetFilter={resetFilter}
            />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            {loading && <ProductGridSkeleton />}

            {!loading && products.length === 0 && (
              <p className="text-center text-gray-600">No products found</p>
            )}

            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MOBILE FILTER BOTTOM SHEET ================= */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
            />

            {/* BOTTOM SHEET */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* HEADER */}
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  className="text-xl text-gray-600"
                  onClick={() => setIsFilterOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-4">
                <ProductFilter
                  filterData={filterData}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  resetFilter={resetFilter}
                />
              </div>

              {/* FOOTER */}
              <div className="p-4 border-t">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold active:scale-95 transition"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductListPage;
