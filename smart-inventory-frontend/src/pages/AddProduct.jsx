// src/pages/AddProduct.jsx
import React, { useState, useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ProductsContext } from "../context/ProductsContext";
import productImg from "../assets/product-left.jpg";

const AddProduct = () => {
  const navigate = useNavigate();
  const { darkMode = false } = useOutletContext?.() || {};
  const { addNewProduct } = useContext(ProductsContext);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState(""); // new state
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !price || !stock || !category) {
      setError("All fields are required!");
      return;
    }

    const productData = {
      name: productName.trim(),
      price: Number(price),
      quantity: Number(stock),
      category: category.trim(),
    };

    try {
      await addNewProduct(productData);
      alert("Product added successfully!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to add product! Check console for details."
      );
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Left Image */}
        <div className={`hidden md:flex md:w-1/2 relative ${darkMode ? "bg-blue-600" : "bg-gray-100"}`}>
          <img src={productImg} alt="Product illustration" className="absolute inset-0 w-full h-full object-cover" />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-10">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 mb-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            <FaArrowLeft /> Back to Products
          </button>

          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
            Add New Product
          </h1>

          {error && (
            <div className="bg-red-100 dark:bg-red-200 text-red-700 p-3 mb-4 rounded font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Enter stock quantity"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
