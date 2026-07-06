import { handleUnauthorized } from "@/helpers/authSession";
import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;
        const url = error.config?.url ?? "";
        const isAuthAttempt =
            url.includes("/auth/login")
            || url.includes("/auth/register")
            || url.includes("/auth/logout");
        const skipToast =
            isAuthAttempt
            || url.includes("/app/scrape-posting")
            || url.includes("/profile/stats");
        const tokenExpiredHeader = error.response?.headers?.["token-expired"] === "true";

        if (!isAuthAttempt && (status === 401 || tokenExpiredHeader)) {
            handleUnauthorized();
            return Promise.reject(error);
        }

        if (!skipToast) {
            const safeMessages: Record<number, string> = {
                400: error.response?.data?.message ?? "Invalid request.",
                403: error.response?.data?.message ?? "You do not have permission to do that.",
                404: "The requested resource was not found.",
                409: error.response?.data?.message ?? "A conflict occurred.",
                422: error.response?.data?.message ?? "Validation failed.",
            };

            const message = safeMessages[status]
                ?? "Something went wrong. Please try again.";

            toast.error(message);
        }

        return Promise.reject(error);
    }
);

api.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }

    return config;
});
