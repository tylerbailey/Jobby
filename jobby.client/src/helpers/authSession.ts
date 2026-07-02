export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

export function clearAuthSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export function redirectToLogin() {
    const path = window.location.pathname;
    if (path !== "/login" && path !== "/register" && path !== "/") {
        window.location.assign("/login");
    }
}

export function handleUnauthorized() {
    clearAuthSession();
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    redirectToLogin();
}
