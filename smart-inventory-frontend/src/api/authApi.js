// src/api/authApi.js
import api from "./apiClient";

/**
 * POST /api/auth/signup
 * body: { username, password, role? }
 */
export const signup = async (payload) => {
  const res = await api.post("/api/auth/signup", payload);
  return res.data;
};

/**
 * POST /api/auth/forgot-password
 * body: { emailOrUsername }
 * (server should send reset token / email; this UI will just call endpoint)
 */
export const forgotPassword = async (payload) => {
  const res = await api.post("/api/auth/forgot-password", payload);
  return res.data;
};

/**
 * POST /api/auth/reset-password
 * body: { token, newPassword }
 * (optional: if backend supports reset token flow)
 */
export const resetPassword = async (payload) => {
  const res = await api.post("/api/auth/reset-password", payload);
  return res.data;
};
