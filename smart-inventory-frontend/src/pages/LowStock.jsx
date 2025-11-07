// src/pages/LowStock.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaBell, FaUpload, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getAllProducts } from "../api/productsApi";

export default function LowStock() {
  const navigate = useNavigate();
  const { darkMode = false } = useOutletContext?.() || {};

  const [products, setProducts] = useState([]);
  const [threshold, setThreshold] = useState(10);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = Number(localStorage.getItem("itemsPerPage") || 6);

  // Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter low-stock items
  const lowItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const qty = p.quantity ?? 0; // treat null as 0
      return qty <= threshold && (!q || p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)));
    });
  }, [products, threshold, query]);

  const totalPages = Math.max(1, Math.ceil(lowItems.length / perPage));
  const pageItems = lowItems.slice((page - 1) * perPage, page * perPage);

  // Mock resolve function (update stock locally only)
  const handleResolve = (id) => {
    const amt = Number(prompt("Enter stock to add (e.g. 10):", "10"));
    if (!amt || isNaN(amt) || amt <= 0) return;
    setProducts((arr) =>
      arr.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity ?? 0) + amt } : p
      )
    );
  };

  const exportCSV = () => {
    const rows = [["id", "name", "sku", "quantity", "price", "category"]];
    lowItems.forEach((p) =>
      rows.push([p.id, p.name, p.sku, p.quantity ?? 0, p.price, p.category])
    );
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "low-stock.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(lowItems, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "low-stock.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Styles
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const muted = darkMode ? "text-gray-300" : "text-gray-600";
  const border = darkMode ? "border-gray-700" : "border-gray-200";
  const hoverRow = darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50";

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>Low Stock Alerts</h1>
          <p className={`text-sm ${muted}`}>Items low in stock (threshold ≤ {threshold})</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-3 py-2 rounded border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          >
            <FaArrowLeft /> Back
          </button>

          <div className={`px-3 py-2 rounded ${cardBg} border ${border} flex items-center gap-3`}>
            <FaBell className={muted} />
            <input
              type="number"
              value={threshold}
              onChange={(e) => { setThreshold(Number(e.target.value)); setPage(1); }}
              min="0"
              className={`w-20 px-2 py-1 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} ${textPrimary}`}
            />
            <div className={`text-sm ${muted}`}>threshold</div>
          </div>

          <div className={`px-3 py-2 rounded ${cardBg} border ${border} flex items-center gap-3`}>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search name or SKU..."
              className={`px-2 py-1 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"} ${textPrimary}`}
            />
          </div>

          <div className="flex gap-2">
            <button onClick={exportCSV} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              <FaUpload /> CSV
            </button>
            <button onClick={exportJSON} className="px-3 py-2 rounded border hover:bg-gray-50">
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`${cardBg} rounded-2xl p-4 border ${border} shadow`}>
        <div className="overflow-x-auto">
          <table className="min-w-full w-full">
            <thead>
              <tr className={`text-left text-xs ${muted} uppercase`}>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">SKU</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageItems.map((p) => (
                <tr key={p.id} className={`transition ${hoverRow} border-b ${border}`}>
                  <td className={`px-3 py-3 ${textPrimary}`}>{p.name}</td>
                  <td className={`px-3 py-3 ${muted}`}>{p.sku}</td>
                  <td className={`px-3 py-3 ${muted}`}>{p.category}</td>
                  <td className={`px-3 py-3 ${textPrimary}`}>₹{p.price}</td>
                  <td className={`px-3 py-3 ${textPrimary}`}>{p.quantity ?? 0}</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => handleResolve(p.id)}
                      className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}

              {pageItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-sm text-gray-500">No low-stock items.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className={`text-sm ${muted}`}>Showing {lowItems.length} results</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Prev
            </button>
            <div className={`px-3 py-1 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>Page {page} / {totalPages}</div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded ${page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
