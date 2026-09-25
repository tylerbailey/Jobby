import { handleSessionExpired, handleUnauthorized } from "@/helpers/authSession";
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

type AuthRequestConfig = InternalAxiosRequestConfig & {
    skipAuthRefresh?: boolean;
    _retry?: boolean;
};

declare module "axios" {
    interface AxiosRequestConfig {
        skipAuthRefresh?: boolean;
    }
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
    withCredentials: true,
});

type RefreshResult = "ok" | "expired" | "failed";

let refreshPromise: Promise<RefreshResult> | null = null;

/** Exchanges a valid refresh token for a new access token. */
function refreshAccessToken() {
    if (!refreshPromise) {
        refreshPromise = api
            .post("/auth/refresh", null, { skipAuthRefresh: true } satisfies AxiosRequestConfig)
            .then(() => "ok" as const)
            .catch((refreshError: unknown) => {
                if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401)
                    return "expired" as const;

                return "failed" as const;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

/** True when this browser still expects an authenticated session. */
function hasRememberedSession() {
    return localStorage.getItem("user") !== null;
}

api.interceptors.response.use(
    response => response,
    async error => {
        const status = error.response?.status;
        const config = error.config as AuthRequestConfig | undefined;
        const url = config?.url ?? "";
        const isAuthAttempt =
            url.includes("/auth/login")
            || url.includes("/auth/register")
            || url.includes("/auth/logout")
            || url.includes("/auth/refresh");
        const skipToast =
            isAuthAttempt
            || url.includes("/app/scrape-posting")
            || url.includes("/profile/stats");
        const tokenExpiredHeader = error.response?.headers?.["token-expired"] === "true";

        if (status === 401 && config && !config.skipAuthRefresh && !isAuthAttempt) {
            const rememberedSession = hasRememberedSession() || tokenExpiredHeader;

            if (!config._retry) {
                config._retry = true;
                const refreshed = await refreshAccessToken();
                if (refreshed === "ok")
                    return api.request(config);

                if (refreshed === "expired") {
                    if (rememberedSession)
                        handleSessionExpired();
                    else
                        handleUnauthorized();
                }

                return Promise.reject(error);
            }

            if (rememberedSession)
                handleSessionExpired();
            else
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
