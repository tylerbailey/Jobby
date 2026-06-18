import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
}); 

api.interceptors.response.use(
    response => response,
    error => {
     const status=  error.response?.status
        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        else {
            const safeMessages: Record<number, string> = {
                400: error.response?.data?.message ?? 'Invalid request.',
                403: 'You do not have permission to do that.',
                404: 'The requested resource was not found.',
                409: error.response?.data?.message ?? 'A conflict occurred.',
                422: error.response?.data?.message ?? 'Validation failed.',
            }

            const message = safeMessages[status]
                ?? 'Something went wrong. Please try again.'

            toast.error(message)
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