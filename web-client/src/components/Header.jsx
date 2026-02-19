import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navLinkStyle = (path) =>
    `text-lg font-medium transition duration-300 px-3 py-1 rounded-md
     ${
       location.pathname === path
         ? "text-indigo-600 bg-indigo-50"
         : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
     }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide cursor-pointer">
          <span className="text-indigo-600">Nav</span>
          <span className="text-pink-500">kal</span>
          <span className="text-gray-800">pana</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className={navLinkStyle("/")}>
            Home
          </Link>

          <Link
            to="/login"
            className={`px-4 py-1.5 rounded-full font-medium transition duration-300
            ${
              location.pathname === "/login"
                ? "bg-indigo-600 text-white shadow-md"
                : "border border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white"
            }`}
          >
            Login
          </Link>

          <Link
            to="/register"
            className={`px-4 py-1.5 rounded-full font-medium transition duration-300
            ${
              location.pathname === "/register"
                ? "bg-pink-500 text-white shadow-md"
                : "bg-pink-500 text-white hover:bg-pink-600 shadow-md"
            }`}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
