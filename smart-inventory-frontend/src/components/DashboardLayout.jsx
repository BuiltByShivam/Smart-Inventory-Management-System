// src/components/DashboardLayout.jsx
import React, { useState, useEffect, useContext, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBell, FaMoon, FaSun, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { ProductsContext } from "../context/ProductsContext";

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // initialize darkMode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch (e) {
      return false;
    }
  });

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const { products } = useContext(ProductsContext);

  // persist darkMode and toggle class
  useEffect(() => {
    try {
      localStorage.setItem("darkMode", darkMode ? "true" : "false");
    } catch (e) {}
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const handleLogout = () => {
    navigate("/login");
    localStorage.removeItem("role");
    window.location.reload(); // reset state
  };

  // Filter products for search
  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [products, searchTerm]);

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } flex h-screen w-full transition-colors duration-300`}
    >
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={role}
        darkMode={darkMode}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto transition-colors duration-300">
        {/* Topbar */}
        <header
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } flex justify-between items-center p-4 shadow border-b sticky top-0 z-50 transition-colors duration-300`}
        >
          <div>
            <h2 className="text-xl font-semibold">Dashboard</h2>
          </div>

          <div className="flex items-center space-x-4 relative">
            {/* Search input */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveIndex(-1);
                }}
                className={`w-full px-4 py-1.5 rounded-full border focus:outline-none focus:ring focus:ring-blue-300 transition-colors duration-300
                  ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-gray-50 text-gray-900 border-gray-300 shadow-sm"}
                `}
              />
              <FaSearch className="absolute right-3 top-2 text-gray-400 dark:text-gray-300" />

              {/* Dropdown results */}
              {searchResults.length > 0 && (
                <ul
                  className={`absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md shadow-lg border transition-colors duration-300 ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  {searchResults.map((p, i) => (
                    <li
                      key={p.id}
                      className={`px-3 py-2 cursor-pointer ${
                        i === activeIndex ? (darkMode ? "bg-gray-600" : "bg-gray-100") : ""
                      }`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => {
                        navigate(`/products/edit/${p.id}`, { state: { product: p } });
                        setSearchTerm("");
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span>{p.name}</span>
                        {p.category && (
                          <span className="text-sm text-gray-400 dark:text-gray-300 ml-2">
                            {p.category}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Notification Bell */}
            <button
              className="relative"
              onClick={() => alert("No new notifications!")}
              aria-label="Notifications"
            >
              <FaBell
                className="text-gray-600 dark:text-gray-300 transition-colors duration-300"
              />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((s) => !s)}
              aria-label="Toggle dark mode"
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <div
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                aria-label="User menu"
              >
                {role?.charAt(0).toUpperCase()}
              </div>

              {userDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg py-2 transition-colors duration-300 ${
                    darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-4 py-2 w-full transition-colors duration-300 ${
                      darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"
                    }`}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 flex-1 transition-colors duration-300">
          <Outlet context={{ darkMode, setDarkMode, role }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
