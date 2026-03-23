import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ProductDetail from "../ProductDetailsPage/productDetail";
import useApi from "../hooks/useApi";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "@mui/material";
import CustomerReviews from "../components/CustomerReviews";
import Breadcrumb from "../components/BreadCrumb";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get("id");

  const { getJsonApi } = useApi();

  const getProduct = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getJsonApi(`api/findProductById/${id}`);

      if (response.status === 200) {
        const fetchedProduct = response.data.product.product;
        const fetchedSimilar = response.data.product.similarProducts || [];

        setProduct(fetchedProduct);
        setSimilarProducts(fetchedSimilar);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getProduct();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id]);

  // Scroll to top on load
  useEffect(() => {
    if (id) {
      getProduct();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [id, getProduct]);

  return (
    <div className="px-4">
      <Breadcrumb/>
      {/* SKELETON PRODUCT PAGE */}
      {loading && (
        <div className="max-w-6xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton variant="rectangular" height={450} />
          <div className="flex flex-col gap-4">
            <Skeleton width="60%" height={40} />
            <Skeleton width="40%" height={30} />
            <Skeleton width="30%" height={30} />
            <Skeleton width="20%" height={30} />

            <Skeleton width="50%" height={50} />
            <Skeleton width="70%" height={20} />
            <Skeleton width="80%" height={100} />
            <Skeleton width="40%" height={40} />
          </div>
        </div>
      )}

      {!loading && product && (
        <>
          <ProductDetail product={product} />

          {/* CUSTOMER REVIEWS */}
          <div className="max-w-6xl mx-auto">
            <CustomerReviews reviews={product.reviews || []} />
          </div>
        </>
      )}

      {/* Similar Products */}
      {loading && (
        <div>
          <h2 className="text-2xl font-semibold mb-5 mt-10">
            Similar Products
          </h2>

          {/* Skeleton Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[180px]">
                <Skeleton variant="rectangular" width={180} height={250} />
                <Skeleton width="80%" height={20} />
                <Skeleton width="60%" height={20} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && similarProducts.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-5 mt-10">
            Similar Products
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-4 md:hidden">
            {similarProducts.map((prod) => (
              <div key={prod._id} className="min-w-[180px]">
                <ProductCard product={prod} />
              </div>
            ))}
          </div>

          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:hidden">
            {similarProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-6 gap-6">
            {similarProducts.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetailsPage;
