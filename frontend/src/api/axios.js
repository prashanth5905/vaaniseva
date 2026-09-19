import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://vaaniseva-rtgy.onrender.com";
const BASE = `${API_URL.replace(/\/$/, "")}/api/v1`;

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