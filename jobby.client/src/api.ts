import axios from "axios";

export const api = axios.create({
    baseURL: "https://localhost:7048/api"
});
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});