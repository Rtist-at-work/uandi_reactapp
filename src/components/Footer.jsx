import { useNavigate } from "react-router-dom";

export const FooterSection = () => {
  const navigate = useNavigate();

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Privacy Policy", path: "/terms-policy/privacy" },
    { label: "Terms & Conditions", path: "/terms-policy/terms" },
  ];

  return (
    <footer className="w-full mt-16 bg-black text-white py-12 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        
        {/* Logo + Description */}
        <div>
          <h2
            className="text-2xl font-bold mb-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            U&I
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Premium innerwear crafted for comfort, style, and everyday confidence.
          </p>

          {/* Tagline */}
          <p className="mt-3 text-xs text-gray-400">
            Designed for movement. Built for confidence.
          </p>
        </div>

        {/* Trust / Highlights */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Why Choose Us</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✔ Premium Quality Fabric</li>
            <li>✔ Secure Payments</li>
            <li>✔ Easy Returns</li>
            <li>✔ Fast Delivery</li>
          </ul>
        </div>

        {/* Company (kept minimal) */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {companyLinks.map((item, i) => (
              <li
                key={i}
                onClick={() => navigate(item.path)}
                className="hover:text-white transition cursor-pointer"
              >
                {item.label}
              </li>
            ))}
          </ul>

          {/* Contact */}
          <div className="mt-4 text-sm text-gray-400">
            <p>Email: support.uandik@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} U&I — All Rights Reserved.
      </div>
    </footer>
  );
};