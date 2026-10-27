import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://goalstab.onrender.com/api",
  // Bound stalled network requests so page loading can fail gracefully instead of spinning forever.
  // This is a request deadline, not a timer that hides the preloader before data is ready.
  timeout: 30000,
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
        // Authentication state is persisted by Pinia; localStorage is the single source for the HTTP client.
        token = localStorage.getItem("token") || "";
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

// Response interceptor: do not hard-reload the app for every 401.
// Login/form errors belong to the form; expired authenticated sessions are
// handled centrally so Pinia state and the current route stay in sync.
const publicAuthEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/google-signin",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/me",
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url || "");
    const isPublicAuthRequest =
      publicAuthEndpoints.some((endpoint) => requestUrl.includes(endpoint)) ||
      requestUrl.includes("/auth/webauthn/");

    if (status === 401 && !isPublicAuthRequest && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("goaltabs:session-expired"));
    }
    return Promise.reject(error);
  },
);

export default api;
