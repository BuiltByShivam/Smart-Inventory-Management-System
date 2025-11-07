// src/api/productsApi.js
import axios from "axios";

// Use env variable if available, fallback to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"; // For Vite
// If you use CRA instead of Vite, uncomment below:
// const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Fetch all products
export const getAllProducts = async () => {
  const res = await api.get("/api/products");
  return res.data;
};

// Fetch single product by ID
export const getProductById = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};

// Add a new product
export const addProduct = async (product) => {
  const res = await api.post("/api/products", product);
  return res.data;
};

// Update existing product
export const updateProduct = async (id, product) => {
  const res = await api.put(`/api/products/${id}`, product);
  return res.data;
};

// Delete a product
export const deleteProduct = async (id) => {
  const res = await api.delete(`/api/products/${id}`);
  return res.data;
};
