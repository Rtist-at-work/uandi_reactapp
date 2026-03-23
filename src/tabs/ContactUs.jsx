import { useCallback, useEffect, useState } from "react";
import useApi from "../hooks/useApi";

const ContactUs = () => {
  const { getJsonApi } = useApi();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContact = useCallback(async () => {
    try {
      const res = await getJsonApi("api/getPolicy/contact");
      console.log("res :", res);
      setContact(res.data?.content || null);
    } catch (err) {
      console.error("Fetch Contact Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔥 Fetch contact data
  useEffect(() => {
    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Loading contact details...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        Contact details not available
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 text-gray-800 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* PAGE HEADER */}
        <h1 className="text-4xl font-bold text-center mb-12 text-blue-700">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — CONTACT INFO */}
          <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
              {contact.description}
            </p>

            <div className="space-y-6 text-gray-700">
              <div>
                <p className="font-semibold text-lg mb-1">📍 Address</p>
                <p>{contact.address}</p>
              </div>

              <div>
                <p className="font-semibold text-lg mb-1">📞 Phone</p>
                <p>{contact.phone}</p>
              </div>

              <div>
                <p className="font-semibold text-lg mb-1">📧 Email</p>
                <p>{contact.email}</p>
              </div>

              <div>
                <p className="font-semibold text-lg mb-1">🕒 Support Hours</p>
                <p>{contact.hours}</p>
              </div>
            </div>
          </div>

          {/* RIGHT — CONTACT FORM */}
          {/* <div className="bg-white p-8 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

            <form className="space-y-5">
              <div>
                <label className="block mb-1 font-medium">Your Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border rounded-lg"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Submit Message
              </button>
            </form>
          </div> */}
        </div>

        {/* MAP SECTION */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Our Location
          </h2>

          <div className="w-full h-72 rounded-xl overflow-hidden shadow border">
            <iframe
              title="store-map"
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.478033479365!2d80.22096647501847!3d13.082680287247768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265d9df03dfcd%3A0x9cfc5d857a522!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
