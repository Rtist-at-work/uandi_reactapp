import Skeleton from "@mui/material/Skeleton";

export default function TwoOfferBoxes({ banners, bannerClick, loading }) {
  const url = import.meta.env.VITE_API_URL;

  const offerBanners =
    banners?.filter((b) => b.bannerType === "offer") || [];

  // Skeleton loader
  if (loading) {
    return (
      <div className="w-full px-6 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-96 rounded-2xl overflow-hidden shadow-lg">
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </div>
        ))}
      </div>
    );
  }

  if (offerBanners.length === 0) return null;

  return (
    <div className="w-full px-6 mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {offerBanners.map((offer) => (
        <div
          key={offer._id}
          className="relative h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer group"
        >
          <img
            src={`${url}/api/mediaDownload/${offer.bannerImg}`}
            alt={offer.heading}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{offer.heading}</h3>
            <p className="text-sm opacity-90">{offer.subHeading}</p>

            <button
              onClick={() => bannerClick(offer.products)}
              className="mt-4 w-max bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Shop Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
