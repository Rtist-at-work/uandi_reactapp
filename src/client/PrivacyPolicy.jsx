import React, { useState, useEffect } from "react";
import Header from "./Header";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  const URI = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const location = useLocation(); // Import useLocation to get the current path

  const [categoryList, setCategoryList] = useState([]);
  const [policy, setPolicy] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null); // Close the current open FAQ
    } else {
      setActiveIndex(index); // Open the clicked FAQ
    }
  };

  // Fetch categories
  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(`${URI}/category`);
        if (response.status === 200 || response.status === 201) {
          setCategoryList(response.data.category);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getCategory();
  }, []);

  // Navigate to product page
  const handleStyleNav = (c, s) => {
    navigate(`/productpage?categorynav=${c}&stylenav=${s}`);
  };

  // Function to get the page title
  const getPageTitle = () => {
    if (location.pathname === "/PrivacyPolicy") return "Privacy Policy";
    if (location.pathname === "/Terms&Services") return "Terms & Conditions";
    if (location.pathname === "/shippingpolicy") {
      return "Shipping Policy";
    }
    if (location.pathname === "/faq") {
      return "Frequently Asked Questions";
    }
    return "Page Not Found";
  };

  // Fetch policy content dynamically based on the page
  useEffect(() => {
    const fetchPolicy = async () => {
      const policyType = getPageTitle(); // Call getPageTitle to get the current page type
      try {
        const response = await axios.get(
          `${URI}/admin/policy/getpolicy/${policyType}`
        );
        if (response.status === 200) {
          console.log(response);
          if (location.pathname === "/faq") {
            setPolicy(response.data[0].faqs);
          } else {
            setPolicy(response.data);
          } // Ensure you have the correct property from the response
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPolicy();
  }, [location.pathname]); // Rerun this effect whenever the path changes
  console.log(policy);
  return (
    <div className="h-screen w-screen">
      <Header />

      <main className="relative h-[85%] w-full overflow-y-auto overflow-x-hidden">
        {/* Category Navigation */}
        <div className="h-6 lg:h-12 w-full flex bg-blue-300 gap-4 px-4 justify-around items-center z-10">
          {categoryList && categoryList.length > 0 ? (
            categoryList.map((category) => (
              <div key={category.category} className="relative group z-30">
                <a className="cursor-pointer text-gray-900">
                  {category.category}
                </a>
                <ul className="absolute left-0 hidden group-hover:block bg-white border z-50 min-w-max transition duration-3000 ease-out hover:ease-in rounded shadow-lg">
                  {category.style.length > 0 ? (
                    category.style.map((style) => (
                      <li
                        key={style.style}
                        className="px-4 py-2 cursor-pointer"
                        onClick={() => {
                          handleStyleNav(category.category, style.style);
                        }}
                      >
                        {style.style}
                      </li>
                    ))
                  ) : (
                    <div>Styles not found</div>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <div>No data</div>
          )}
        </div>

        {/* Policy Content */}
        <div className="max-h-max w-full px-8 sm:px-16 lg:px-32 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {getPageTitle()}
          </h1>
          {location.pathname !== "/faq" && (
            <div
              className="text-gray-500 leading-relaxed tracking-wide text-lg space-y-4"
              dangerouslySetInnerHTML={{ __html: policy }}
            />
          )}
        </div>

        {location.pathname === "/faq" && (
          <div className="space-y-4">
            {/* Render FAQ data dynamically */}
            {Array.isArray(policy) &&
              policy.length > 0 &&
              policy.map((faqCategory, categoryIndex) => (
                <div
                  key={categoryIndex}
                  className="border border-gray-300 rounded-lg shadow-sm w-[60%] mx-auto"
                >
                  <h2 className="text-xl font-semibold p-4 bg-gray-100">
                    {faqCategory.title}
                  </h2>
                  {faqCategory.items.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-t border-gray-300">
                      <div
                        className="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-100 rounded-t-lg"
                        onClick={() =>
                          toggleAnswer(`${categoryIndex}-${faqIndex}`)
                        }
                        aria-expanded={
                          activeIndex === `${categoryIndex}-${faqIndex}`
                            ? "true"
                            : "false"
                        }
                      >
                        <h3 className="text-lg font-semibold">
                          {faq.question}
                        </h3>
                        <span className="text-xl">
                          {activeIndex === `${categoryIndex}-${faqIndex}`
                            ? "-"
                            : "+"}
                        </span>
                      </div>
                      {activeIndex === `${categoryIndex}-${faqIndex}` && (
                        <div className="px-4 py-3 bg-gray-50 rounded-b-lg">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </div>  
        )}
        <Footer />
      </main>
    </div>
  );
};

export default PrivacyPolicy;
