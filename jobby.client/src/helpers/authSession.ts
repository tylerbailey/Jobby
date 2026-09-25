export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";
export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";
export const SESSION_EXPIRED_MESSAGE = "Session has expired. Please log in.";

const SESSION_EXPIRED_KEY = "auth:session-expired";

let sessionExpiryHandled = false;

/** Removes the stored user from local storage. */
export function clearAuthSession() {
    localStorage.removeItem("user");
}

/** Remembers that the next login screen should explain the expired session. */
export function markSessionExpired() {
    sessionStorage.setItem(SESSION_EXPIRED_KEY, SESSION_EXPIRED_MESSAGE);
}

/** Returns the expired-session notice without removing it. */
export function peekSessionExpiredMessage(): string | null {
    return sessionStorage.getItem(SESSION_EXPIRED_KEY);
}

/** Clears the expired-session notice after the user signs in again. */
export function clearSessionExpiredMessage() {
    sessionStorage.removeItem(SESSION_EXPIRED_KEY);
}

/** Allows a later expired session to show the notice again after a new login. */
export function resetSessionExpiryHandling() {
    sessionExpiryHandled = false;
}

/** True after the current session has already been cleared for expiry. */
export function isSessionExpiryHandled() {
    return sessionExpiryHandled;
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
    if (sessionExpiryHandled)
        return;

    redirectToLogin();
}

/** Clears the session and asks the app to show the expired-session message before login. */
export function handleSessionExpired() {
    if (sessionExpiryHandled)
        return;

    sessionExpiryHandled = true;
    clearAuthSession();
    markSessionExpired();
    window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
}
