import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-100 shadow p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link
            href="/search"
            className="text-blue-600 font-semibold hover:underline"
          >
            Search
          </Link>
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/bookshelf"
              className="text-gray-700 hover:text-blue-600 hover:underline"
            >
              Bookshelf
            </Link>
          </li>
          <li>
            <Link
              href="/insights"
              className="text-gray-700 hover:text-blue-600 hover:underline"
            >
              Insights
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
