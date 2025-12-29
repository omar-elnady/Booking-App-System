import axios from "axios";
import { useAuthStore } from "@features/auth/store/authStore";
import { useLanguageStore } from "@/store/languageStore";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_EVENTS_GET
    ? import.meta.env.VITE_EVENTS_GET.replace("/event", "")
    : "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const language = useLanguageStore.getState().language;
    const bearerPrefix = import.meta.env.VITE_BEARER_TOKEN || "Bearer ";

    if (token) {
      config.headers.Authorization = `${bearerPrefix}${token}`;
    }

    if (language) {
      config.headers["Accept-Language"] = language;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
