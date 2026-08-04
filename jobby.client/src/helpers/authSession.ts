export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

/** Removes the stored user from local storage. */
export function clearAuthSession() {
    localStorage.removeItem("user");
}

/** Navigates to the login page unless already on an auth-related page. */
export function redirectToLogin() {
    const path = window.location.pathname;
    if (path !== "/login" && path !== "/register" && path !== "/") {
        window.location.assign("/login");
    }
}

/** Clears the auth session, notifies listeners, and redirects to login. */
export function handleUnauthorized() {
    clearAuthSession();
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    redirectToLogin();
}
