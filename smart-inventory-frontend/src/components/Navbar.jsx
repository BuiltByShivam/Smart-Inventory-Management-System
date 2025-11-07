// src/components/Navbar.jsx working !
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ role, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole("");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <h1 className="text-lg font-bold">Smart Inventory</h1>
            <div className="hidden sm:flex items-center space-x-4">
              <Link to="/dashboard" className="text-white hover:underline">
                Dashboard
              </Link>
              <Link to="/products" className="text-white hover:underline">
                Products
              </Link>
              {role === "admin" && (
                <Link to="/products/add" className="text-white hover:underline">
                  Add Product
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
