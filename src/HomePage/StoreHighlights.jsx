import { Truck, ShieldCheck, Headphones, Sparkles } from "lucide-react";

const StoreHighlights = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast & Safe Delivery",
      desc: "Quick delivery with full safety.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Secure Payments",
      desc: "Your transactions are fully protected.",
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Premium Quality",
      desc: "Innerwear made for comfort and style.",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Customer Support",
      desc: "Always here to help you anytime.",
    },
  ];

  return (
    <div className="w-full mt-10 py-10 bg-gray-50 rounded-3xl">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        {features.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center p-4 hover:scale-105 transition-transform duration-300"
          >
            <div className="p-4 bg-white shadow rounded-full mb-3">
              {item.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {item.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreHighlights