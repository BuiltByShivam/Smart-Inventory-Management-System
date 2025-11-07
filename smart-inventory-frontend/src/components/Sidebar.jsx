// src/components/Sidebar.jsx
import React from "react";
import { FaBox, FaChartLine, FaPlus, FaEye, FaBell, FaCog, FaUsers } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Sidebar component
 * - nicer hover gradients
 * - active left indicator bar
 * - improved SIMS branding
 * - collapse tooltip titles preserved
 */
const Sidebar = ({ sidebarOpen, setSidebarOpen, role, darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // public menu (no Users here — Users is admin-only and rendered separately)
  const menuItems = [
    { name: "Dashboard", icon: <FaChartLine />, path: "/dashboard" },
    { name: "Products", icon: <FaBox />, path: "/products" },
    { name: "Low Stock Alerts", icon: <FaBell />, path: "/low-stock" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  const adminItems = [
    { name: "View Products", icon: <FaEye />, path: "/products" },
    { name: "Add/Edit Products", icon: <FaPlus />, path: "/products/add" },
  ];

  const isActive = (path) => {
    // treat / and /dashboard as same if needed; simple exact-match for now
    return location.pathname === path;
  };

  return (
    <aside
      className={`flex-shrink-0 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-lg transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}
    >
      {/* Branding + collapse button */}
      <div
        className={`flex items-center justify-between p-4 transition-colors duration-300 border-b ${
          darkMode ? "border-gray-800" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          {/* logo circle */}
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-full ${
              darkMode ? "bg-indigo-600" : "bg-indigo-100"
            }`}
          >
            <span className={`${darkMode ? "text-white" : "text-indigo-700"} font-bold`}>
              S
            </span>
          </div>

          {/* title - color tweaked */}
          <h1
            className={`text-lg font-bold ${!sidebarOpen && "hidden"} ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}
            style={{ letterSpacing: 0.2 }}
          >
            SIMS
          </h1>
        </div>

        {/* collapse icon */}
        <button
          className="text-xl opacity-80 hover:opacity-100"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li
                key={item.name}
                className={`relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
                  ${active ? (darkMode ? "bg-indigo-700 text-white" : "bg-indigo-500 text-white") : ""}
                  ${
                    !active &&
                    (darkMode
                      ? "hover:bg-gradient-to-r hover:from-indigo-900 hover:to-indigo-800"
                      : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:translate-x-1")
                  }`}
                onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.name : ""}
              >
                {/* active left bar */}
                {sidebarOpen && active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r"
                    style={{ background: darkMode ? "#4F46E5" : "#2563EB" }}
                  />
                )}

                {/* icon */}
                <div className="text-lg flex-shrink-0 ml-2">
                  {item.icon}
                </div>

                {/* label */}
                <span className={`ml-1 ${!sidebarOpen && "hidden"} font-medium`}>
                  {item.name}
                </span>
              </li>
            );
          })}

          {/* Conditionally render Users link only for admin */}
          {role === "admin" && (
            <li
              key="Users"
              className={`relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
                ${isActive("/users") ? (darkMode ? "bg-indigo-700 text-white" : "bg-indigo-500 text-white") : ""}
                ${
                  !isActive("/users") &&
                  (darkMode
                    ? "hover:bg-gradient-to-r hover:from-indigo-900 hover:to-indigo-800"
                    : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:translate-x-1")
                }`}
              onClick={() => navigate("/users")}
              title={!sidebarOpen ? "Users" : ""}
            >
              {sidebarOpen && isActive("/users") && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r"
                  style={{ background: darkMode ? "#4F46E5" : "#2563EB" }}
                />
              )}

              <div className="text-lg flex-shrink-0 ml-2">
                <FaUsers />
              </div>

              <span className={`ml-1 ${!sidebarOpen && "hidden"} font-medium`}>
                Users
              </span>
            </li>
          )}

          {/* separator */}
          <li>
            <div
              className={`my-2 mx-2 h-px ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
            />
          </li>

          {/* admin-specific items */}
          {role === "admin" &&
            adminItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li
                  key={item.name}
                  className={`relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
                    ${active ? (darkMode ? "bg-green-700 text-white" : "bg-green-500 text-white") : ""}
                    ${
                      !active &&
                      (darkMode
                        ? "hover:bg-gradient-to-r hover:from-green-900 hover:to-green-800"
                        : "hover:bg-gradient-to-r hover:from-green-50 hover:to-green-50 hover:translate-x-1")
                    }`}
                  onClick={() => navigate(item.path)}
                  title={!sidebarOpen ? item.name : ""}
                >
                  {/* active left bar */}
                  {sidebarOpen && active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 rounded-r"
                      style={{ background: darkMode ? "#16A34A" : "#059669" }}
                    />
                  )}

                  <div className="text-lg flex-shrink-0 ml-2">{item.icon}</div>
                  <span className={`ml-1 ${!sidebarOpen && "hidden"} font-medium`}>
                    {item.name}
                  </span>
                </li>
              );
            })}
        </ul>
      </nav>

      {/* footer / creative touch */}
      <div className="p-3 border-t text-sm flex items-center justify-between gap-2"
        style={{ borderTopColor: darkMode ? "#111827" : "#f3f4f6" }}
      >
        <div className={`flex items-center gap-2 ${!sidebarOpen && "justify-center w-full"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            v1
          </div>
          {sidebarOpen && <div className="text-xs text-gray-500">Lightweight · Fast</div>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
