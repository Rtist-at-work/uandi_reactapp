import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi";

const TermsAndPolicy = () => {
  const { type } = useParams(); // ✅ get param
  const [content, setContent] = useState("");
  const { getJsonApi } = useApi();

  const fetchContent = useCallback(async () => {
    try {
      if (!type) return;

      const res = await getJsonApi(
        `api/getPolicy/${type}`,
        "application/json"
      );

      setContent(res?.data?.content || "");
    } catch (err) {
      console.error("Fetch Content Error:", err);
    }
  }, [type, getJsonApi]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const pageTitle =
    type === "privacy"
      ? "Privacy Policy"
      : type === "terms"
      ? "Terms & Conditions"
      : "";

  return (
    <div className="w-full bg-gray-50 text-gray-800 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-700">
          {pageTitle}
        </h1>

        {/* CONTENT */}
        <section className="bg-white p-8 rounded-xl shadow-sm border">
          {content ? (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-center text-gray-500">
              Loading content...
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TermsAndPolicy;
