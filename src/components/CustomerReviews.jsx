import { useState, useMemo } from "react";
import { Star } from "lucide-react";

const REVIEWS_PER_PAGE = 5;

const CustomerReviews = ({ reviews = [] }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * REVIEWS_PER_PAGE;
    return reviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [page, reviews]);

  if (!reviews.length) {
    return (
      <div className="mt-10 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-3">Customer Reviews</h2>
        <p className="text-gray-500">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-6">Customer Reviews ({reviews.length})</h2>

      {/* REVIEW LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {paginatedReviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition"
          >
            <div className="flex items-center mb-3">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-white font-bold text-sm mr-3">
                {review.name ? review.name[0].toUpperCase() : "A"}
              </div>

              <div className="flex flex-col">
                <p className="font-semibold text-gray-800">
                  {review.name || "Anonymous"}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i <= review.rating ? "#facc15" : "none"}
                  strokeWidth={1.5}
                  className="mr-1"
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-gray-700 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
