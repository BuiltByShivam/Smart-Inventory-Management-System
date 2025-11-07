// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import { ProductsProvider } from "./context/ProductsContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Settings from "./pages/Settings";
import LowStock from "./pages/LowStock";
import Users from "./pages/Users";

import ResetPassword from "./pages/ResetPassword";

function App() {
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  return (
    <ProductsProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={role ? <DashboardLayout role={role} /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<Settings />} />
          <Route path="low-stock" element={<LowStock />} />
          <Route
            path="users"
            element={role === "admin" ? <Users /> : <Navigate to="/dashboard" />}
          />

          <Route
            path="products/add"
            element={role === "admin" ? <AddProduct /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="products/edit/:id"
            element={role === "admin" ? <UpdateProduct /> : <Navigate to="/dashboard" />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ProductsProvider>
  );
}

export default App;
