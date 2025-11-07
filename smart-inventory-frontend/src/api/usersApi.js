// src/api/usersApi.js
import api from "./apiClient";

export const getAllUsers = async () => {
  const res = await api.get("/api/users");
  return res.data;
};
