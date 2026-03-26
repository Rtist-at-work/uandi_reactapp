import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export const CustomerTestimonials = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      review:
        "Super comfortable innerwear and excellent quality! Delivery was also very quick.",
      location: "Mumbai, India",
      image:
        "https://images.unsplash.com/photo-1603415526960-f7e0328ea7a1?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Ananya Verma",
      review:
        "Loved the fabric and fit. Truly premium feel at a great price! Highly recommended.",
      location: "Delhi, India",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Karthik Menon",
      review:
        "Great value for money. The material is soft and breathable. Definitely buying again!",
      location: "Bangalore, India",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    },
  ];

  return (
    <div className="w-full mt-14 px-6 ">
      <h2 className="text-xl font-bold mb-6 text-center">
        What Our Customers Say
      </h2>

      <div className="flex gap-6 no-scrollbar pb-4 mt-16">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="min-w-[280px] sm:min-w-[320px] bg-gradient-to-br from-white to-gray-50 p-6 rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
          >
            {/* Floating Image */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-999">
              <LazyLoadImage
                src={t.image}
                alt={t.name}
                className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>

            <div className="mt-10 text-center">
              <h3 className="font-semibold text-gray-900 text-base">
                {t.name}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{t.location}</p>

              <p className="text-gray-700 text-sm leading-relaxed italic">
                “{t.review}”
              </p>
            </div>

            {/* Decorative bottom bar */}
            <div className="mt-4 h-1 w-16 bg-black/80 rounded-full mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
