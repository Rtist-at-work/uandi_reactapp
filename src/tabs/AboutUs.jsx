import { useRef, useState, useCallback, useEffect } from "react";
import { Play, Sparkles, Heart, Globe } from "lucide-react";
import useApi from "../hooks/useApi";

export default function AboutUs() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const url = import.meta.env.VITE_API_URL;


  const [about, setAbout] = useState({
    hero: {
      badge: "",
      title: "",
      subtitle: "",
    },
    ceo: {
      heading: "",
      message: "",
      videoUrl: "",
    },
    pillars: [],
  });

  const { getJsonApi } = useApi();

  const playVideo = () => {
    setPlaying(true);
    videoRef.current?.play();
  };

  const getData = useCallback(async () => {
    try {
      const res = await getJsonApi("api/getabout", "application/json");

      if (res?.data?.data) {
        const apiData = res.data.data;

        setAbout({
          hero: {
            badge: apiData.hero?.badge ?? "",
            title: apiData.hero?.title ?? "",
            subtitle: apiData.hero?.subtitle ?? "",
          },
          ceo: {
            heading: apiData.ceo?.heading ?? "",
            message: apiData.ceo?.message ?? "",
            videoUrl: apiData.ceo?.videoUrl ?? "",
          },
          pillars: apiData.pillars ?? [],
        });
      }
    } catch (error) {
      console.error("About API error:", error);
    }
  }, [getJsonApi]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="w-full bg-white text-gray-800">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100">
        <div className="text-center px-6 max-w-4xl">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
            {about.hero.badge}
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900">
            {about.hero.title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600">
            {about.hero.subtitle}
          </p>
        </div>
      </section>

      {/* ================= CEO VIDEO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative rounded-[2rem] overflow-hidden shadow-lg bg-black h-[320px]">

          {about.ceo.videoUrl && (
            <>
              <video
                ref={videoRef}
                src={`${url}/api/mediaDownload/${about.ceo.videoUrl}`}
                className="w-full h-full object-cover"
                controls={playing}
              />

              {!playing && (
                <button
                  onClick={playVideo}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50"
                >
                  <Play className="w-16 h-16 text-white" />
                </button>
              )}
            </>
          )}
        </div>

        <div>
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
            From Our CEO
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {about.ceo.heading}
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed">
            {about.ceo.message}
          </p>
        </div>
      </section>

      {/* ================= BRAND PILLARS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          What Defines Us
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {about.pillars.map((item, i) => (
            <div
              key={item._id || i}
              className="p-8 rounded-[2rem] bg-white border shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                {i === 0 && <Sparkles />}
                {i === 1 && <Heart />}
                {i === 2 && <Globe />}
              </div>

              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6 text-center bg-gradient-to-br from-slate-100 to-indigo-100">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Built for Everyday Living
        </h2>

        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
          Discover essentials designed to feel good today — and years from now.
        </p>

        <button className="px-10 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition">
          Explore Collection
        </button>
      </section>
    </div>
  );
}
