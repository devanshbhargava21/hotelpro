import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8001/api",
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const errMsg = (e) => e.response?.data?.message || "Something went wrong. Is the server running?";

// 2025-09-23 -> 23-09-2025
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { timeZone: "UTC" }).replaceAll("/", "-");

export default api;
