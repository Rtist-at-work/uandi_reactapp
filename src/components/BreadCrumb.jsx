import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x);

  return (
    <nav className="text-sm text-gray-600 mb-4 mt-4 px-6">
      <ul className="flex items-center flex-wrap gap-1">
        <li>
          <Link to="/" className="hover:text-black font-medium">
            Home
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center gap-1">
              <span className="mx-1">›</span>

              {isLast ? (
                <span className="text-gray-800 font-semibold capitalize">
                  {decodeURIComponent(value.replace(/-/g, " "))}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-black capitalize"
                >
                  {decodeURIComponent(value.replace(/-/g, " "))}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
