import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://goalstab.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    // if not yet synced to localStorage, fall back to pinia store
    if (!token) {
      try {
        // lazy import to avoid circular deps
        const { useAuthStore } = require("@/stores/auth");
        const auth = useAuthStore();
        token = auth.token || "";
      } catch (e) {
        // ignore if store not ready
      }
    }
    if (token) {
      // support both common conventions
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
