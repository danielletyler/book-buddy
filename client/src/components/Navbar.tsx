import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end items-center space-x-10">
        <Link
          href="/search"
          className="text-gray-600 text-base font-medium hover:text-indigo-600 transition duration-200 ease-in-out"
        >
          Search
        </Link>
        <Link
          href="/bookshelf"
          className="text-gray-600 text-base font-medium hover:text-indigo-600 transition duration-200 ease-in-out"
        >
          Bookshelf
        </Link>
        <Link
          href="/insights"
          className="text-gray-600 text-base font-medium hover:text-indigo-600 transition duration-200 ease-in-out"
        >
          Insights
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
