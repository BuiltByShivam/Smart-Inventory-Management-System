// src/pages/Dashboard.jsx working !!
import React, { useContext } from "react";
import CountUp from "react-countup";
import { FaBox, FaBell, FaChartLine, FaPlus, FaEye } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ProductsContext } from "../context/ProductsContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { darkMode = false, role = "guest" } = useOutletContext() || {};
  const { products, loading } = useContext(ProductsContext);

  // Dynamic counts
  const totalProducts = products?.length || 0;
  const lowStock = products?.filter((p) => p.quantity <= 5).length || 0;

  return (
    <div className="w-full">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          Welcome back 👋
        </h2>
        <p className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          You are logged in as{" "}
          <span className={`${darkMode ? "text-blue-300" : "text-blue-600"} font-medium`}>{role || "guest"}</span>.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Total Products */}
        <div className={`p-6 rounded-2xl shadow-lg transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl ${darkMode ? "bg-gradient-to-r from-gray-800 to-gray-800 text-gray-100" : "bg-gradient-to-r from-blue-50 to-blue-100 text-gray-900"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Total Products</h3>
              <p className="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp end={loading ? 0 : totalProducts} duration={1.5} />
              </p>
            </div>
            <FaBox className={`text-4xl ${darkMode ? "text-blue-300" : "text-blue-400"}`} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-6 rounded-2xl shadow-lg transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl ${darkMode ? "bg-gradient-to-r from-gray-800 to-gray-800 text-gray-100" : "bg-gradient-to-r from-red-50 to-red-100 text-gray-900"}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
              <p className="mt-3 text-3xl font-bold text-red-600 dark:text-red-400">
                <CountUp end={loading ? 0 : lowStock} duration={1.5} />
              </p>
            </div>
            <FaBell className={`text-4xl ${darkMode ? "text-red-300" : "text-red-400"}`} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-2xl shadow-lg transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              Quick Actions <FaChartLine className="ml-2 text-gray-400" />
            </h3>
            <div /> {/* spacer */}
          </div>

          <div className="mt-4 flex flex-col space-y-3">
            <button
              className={`flex items-center gap-2 justify-center py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              onClick={() => navigate("/products")}
            >
              <FaEye /> View Products
            </button>

            {role === "admin" && (
              <button
                className={`flex items-center gap-2 justify-center py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${darkMode ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
                onClick={() => navigate("/products/add")}
              >
                <FaPlus /> Add / Edit Products
              </button>
            )}
          </div>
        </div>

        {/* Fillers for layout balance */}
        <div className="hidden xl:block" />
        <div className="hidden xl:block" />
      </div>
    </div>
  );
};

export default Dashboard;
