// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaDownload } from "react-icons/fa";

export default function Settings() {
  const navigate = useNavigate();
  // Read outlet context (DashboardLayout should provide { darkMode, role, setDarkMode })
  const outlet = useOutletContext?.() || {};
  const { darkMode: outletDarkMode, role = "", setDarkMode } = outlet;

  // local state: prefer outlet value if provided otherwise fallback to localStorage
  const [darkMode, setLocalDarkMode] = useState(() => {
    if (typeof outletDarkMode !== "undefined") return outletDarkMode;
    return localStorage.getItem("darkMode") === "true";
  });
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    return Number(localStorage.getItem("itemsPerPage") || 6);
  });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // if outletDarkMode changes externally, sync local state
    if (typeof outletDarkMode !== "undefined" && outletDarkMode !== darkMode) {
      setLocalDarkMode(outletDarkMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outletDarkMode]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleDark = () => {
    const newVal = !darkMode;
    setLocalDarkMode(newVal);

    // If DashboardLayout provided a setter, call it (so change applies instantly)
    if (typeof setDarkMode === "function") {
      setDarkMode(newVal);
      setNotice("Theme updated");
      return;
    }

    // fallback: store preference and notify
    localStorage.setItem("darkMode", newVal ? "true" : "false");
    setNotice("Saved preference. Reload to apply theme.");
  };

  const handleItemsPerPage = (v) => {
    setItemsPerPage(v);
    localStorage.setItem("itemsPerPage", String(v));
    setNotice("Items per page saved.");
  };

  const exportSettings = () => {
    const dump = { itemsPerPage, darkMode: localStorage.getItem("darkMode") || null };
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "app-settings.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Settings exported (JSON).");
  };

  // helpers for styling depending on theme
  const sectionClass = `p-5 rounded-lg shadow border ${darkMode ? "bg-gray-800 text-gray-100 border-gray-700" : "bg-white text-gray-800 border-gray-200"}`;
  const smallMuted = darkMode ? "text-gray-300" : "text-gray-600";

  const pageBtnClass = (selected) =>
    `px-3 py-1 rounded border transition ${selected
      ? "bg-blue-600 text-white border-blue-600"
      : darkMode
      ? "text-gray-200 border-gray-700 hover:bg-gray-700"
      : "text-gray-700 border-gray-300 hover:bg-gray-100"
    }`;

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account */}
        <section className={sectionClass}>
          <h2 className="font-semibold mb-3">Account</h2>
          <div className={`text-sm ${smallMuted} mb-4`}>
            Role: <span className={`font-medium ${darkMode ? "text-gray-100" : "text-gray-900"} ml-2`}>{role || "guest"}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-4 py-2 rounded border ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"}`}
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className={sectionClass}>
          <h2 className="font-semibold mb-3">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm" style={{ color: darkMode ? undefined : undefined }}>Dark Mode</div>
              <div className="text-xs" style={{ color: darkMode ? undefined : undefined }}>Toggle site theme</div>
            </div>

            {/* Simple switch */}
            <div>
              <button
                onClick={toggleDark}
                aria-pressed={!!darkMode}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${darkMode ? "bg-blue-600" : "bg-gray-200"}`}
              >
                <span
                  className={`transform transition-transform inline-block w-4 h-4 bg-white rounded-full ml-1 ${darkMode ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs" style={{ color: darkMode ? undefined : undefined }}>
            If the app doesn't update immediately, your theme preference is saved and will apply on next load.
          </p>
        </section>

        {/* App */}
        <section className={sectionClass}>
          <h2 className="font-semibold mb-3">App</h2>

          <div className="mb-3">
            <div className="text-sm mb-2">Items per page</div>
            <div className="flex gap-2">
              {[6, 12, 24].map((n) => (
                <button
                  key={n}
                  onClick={() => handleItemsPerPage(n)}
                  className={pageBtnClass(itemsPerPage === n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs" style={{ color: darkMode ? undefined : undefined }}>Used by product lists for pagination.</p>
          </div>

          <div>
            <button
              onClick={exportSettings}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded border ${darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"}`}
            >
              <FaDownload /> Export settings
            </button>
          </div>
        </section>

        {/* About */}
        <section className={sectionClass}>
          <h2 className="font-semibold mb-3">About</h2>
          <div className={`text-sm ${smallMuted} mb-2`}>
            <strong>Smart Inventory</strong>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">Version 0.1.0</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            All trademarks are reserved copy of the website or content will result in legal actions.
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
              Developer : Shivam Kumar Tiwari
          </div>
        </section>
      </div>

      {/* Notice */}
      {notice && (
        <div className="fixed right-6 bottom-6 p-3 bg-blue-600 text-white rounded shadow z-50">
          {notice}
        </div>
      )}
    </div>
  );
}
