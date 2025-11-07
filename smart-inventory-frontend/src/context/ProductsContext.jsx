// src/context/ProductsContext.jsx
import React, { createContext, useState, useEffect } from "react";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../api/productsApi";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all products on mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a new product
  const addNewProduct = async (product) => {
    try {
      const data = await addProduct(product);
      setProducts((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error("Add product error:", err);
      // throw a user-friendly error
      throw new Error(
        err.response?.data?.message || "Failed to add product. Try again."
      );
    }
  };

  // Update existing product
  const updateExistingProduct = async (id, product) => {
    try {
      const data = await updateProduct(id, product);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
      return data;
    } catch (err) {
      console.error("Update product error:", err);
      throw new Error(
        err.response?.data?.message || "Failed to update product. Try again."
      );
    }
  };

  // Delete product
  const deleteExistingProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete product error:", err);
      throw new Error(
        err.response?.data?.message || "Failed to delete product. Try again."
      );
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addNewProduct,
        updateExistingProduct,
        deleteExistingProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
