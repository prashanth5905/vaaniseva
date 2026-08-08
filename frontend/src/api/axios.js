import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

const api = axios.create({
    baseURL: BASE,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;