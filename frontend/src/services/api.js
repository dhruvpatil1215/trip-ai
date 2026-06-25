import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://trip-ai-yiyj.onrender.com/api",
});

// Request interceptor to add JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
