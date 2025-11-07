// src/pages/Products.jsx
import React, { useContext, useState, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ProductsContext } from "../context/ProductsContext";

export default function Products() {
  const navigate = useNavigate();
  const { darkMode = false, role = "guest" } = useOutletContext?.() || {};
  const { products, deleteExistingProduct } = useContext(ProductsContext);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });
  const [page, setPage] = useState(1);
  const perPage = 6;

  // Filter + sort
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = products.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );

    arr.sort((a, b) => {
      const k = sortBy.key;
      const dir = sortBy.dir === "asc" ? 1 : -1;
      if (k === "name") return a.name.localeCompare(b.name) * dir;
      if (k === "price") return (a.price - b.price) * dir;
      if (k === "quantity") return ((a.quantity || 0) - (b.quantity || 0)) * dir;
      return 0;
    });
    return arr;
  }, [products, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSortToggle = (key) => {
    setSortBy((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const handleDelete = async (id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;
    if (!window.confirm(`Delete "${item.name}"?`)) return;

    try {
      await deleteExistingProduct(id);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product");
    }
  };

  const clearFilters = () => {
    setQuery("");
    setSortBy({ key: "name", dir: "asc" });
    setPage(1);
  };

  // Styling helpers
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-gray-100" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-600";
  const border = darkMode ? "border-gray-700" : "border-gray-200";
  const hoverRow = darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50";

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-semibold ${textPrimary}`}>Products</h1>
          <p className={`text-sm ${muted}`}>Manage your products (live backend data).</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`relative ${cardBg} rounded-md p-2 border ${border} flex items-center`}>
            <FaSearch className={`text-sm ${muted}`} />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Search by name, category..."
              className={`ml-2 bg-transparent focus:outline-none w-64 ${textPrimary}`}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="ml-2 text-sm text-gray-400 hover:text-gray-600"
              >
                clear
              </button>
            )}
          </div>

          {role === "admin" && (
            <button
              onClick={() => navigate("/products/add")}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
            >
              <FaPlus /> Add Product
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={`${cardBg} p-4 rounded-2xl shadow transition-colors border ${border}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">Sort:</div>
            <button onClick={() => handleSortToggle("name")} className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Name</button>
            <button onClick={() => handleSortToggle("price")} className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Price</button>
            <button onClick={() => handleSortToggle("quantity")} className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Qty</button>
            <button onClick={clearFilters} className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Reset</button>
          </div>
          <div className={`text-sm ${muted}`}>
            Showing <span className="font-semibold text-gray-700 dark:text-gray-100">{filtered.length}</span> results
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className={`text-left text-xs ${muted} uppercase`}>
                <th className="px-3 py-2">Name</th>
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
                  <td className={`px-3 py-3 ${muted}`}>{p.category || "-"}</td>
                  <td className={`px-3 py-3 ${textPrimary}`}>₹{p.price}</td>
                  <td className={`px-3 py-3 ${textPrimary}`}>{p.quantity ?? 0}</td>
                  <td className="px-3 py-3 text-right">
                    {role === "admin" && (
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/products/edit/${p.id}`, { state: { product: p } })}
                          className="px-3 py-1 rounded bg-indigo-500 hover:bg-indigo-600 text-white transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-3 py-6 text-center text-sm text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
