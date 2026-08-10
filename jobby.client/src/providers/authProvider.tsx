import { AuthContext } from "@/context/authContext";
import { getStoredUser, isSessionExpired, msUntilSessionExpiry } from "@/helpers/authHelpers";
import { AUTH_UNAUTHORIZED_EVENT, handleUnauthorized } from "@/helpers/authSession";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/services/authService";
import type { AuthContextType, User } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

/** Provides authentication state and actions to the rest of the app. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getStoredUser<User>());
    const [isInitialized, setIsInitialized] = useState(false);
    const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /** Clears the stored user from state and local storage. */
    const clearUser = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    /** Cancels any pending session-expiry timer. */
    const clearExpiryTimer = useCallback(() => {
        if (expiryTimerRef.current !== null) {
            clearTimeout(expiryTimerRef.current);
            expiryTimerRef.current = null;
        }
    }, []);

    /** Schedules auto-logout when the cached session expiry is reached. */
    const scheduleExpiryLogout = useCallback((expiresAt: string | null | undefined) => {
        clearExpiryTimer();
        if (!expiresAt)
            return;

        const delay = msUntilSessionExpiry(expiresAt);
        if (delay <= 0) {
            handleUnauthorized();
            return;
        }

        expiryTimerRef.current = setTimeout(() => {
            handleUnauthorized();
        }, delay);
    }, [clearExpiryTimer]);

    /** Persists user to state, local storage, and the expiry timer. */
    const persistUser = useCallback((nextUser: User) => {
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
        scheduleExpiryLogout(nextUser.expiresAt);
    }, [scheduleExpiryLogout]);

    /** Logs out the current user and clears local session state. */
    const logout = useCallback(async () => {
        clearExpiryTimer();
        try {
            await logoutUser();
        } catch {
            // cookie may already be gone
        }
        clearUser();
    }, [clearExpiryTimer, clearUser]);

    useEffect(() => {
        let cancelled = false;

        /** Loads the current user session on mount, clearing it if unauthorized. */
        async function initSession() {
            const stored = getStoredUser<User>();
            if (stored && isSessionExpired(stored.expiresAt)) {
                clearUser();
                handleUnauthorized();
                if (!cancelled)
                    setIsInitialized(true);
                return;
            }

            if (stored?.expiresAt)
                scheduleExpiryLogout(stored.expiresAt);

            try {
                const currentUser = await getCurrentUser();
                if (cancelled)
                    return;

                persistUser({
                    ...currentUser,
                    expiresAt: currentUser.expiresAt ?? stored?.expiresAt ?? null,
                });
            } catch (error) {
                if (cancelled)
                    return;

                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    clearExpiryTimer();
                    clearUser();
                }
            } finally {
                if (!cancelled)
                    setIsInitialized(true);
            }
        }

        initSession();
        return () => {
            cancelled = true;
            clearExpiryTimer();
        };
    }, [clearExpiryTimer, clearUser, persistUser, scheduleExpiryLogout]);

    useEffect(() => {
        /** Clears the local session when an unauthorized event is received. */
        function onUnauthorized() {
            clearExpiryTimer();
            clearUser();
            void logoutUser().catch(() => {});
        }

        window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
        return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    }, [clearExpiryTimer, clearUser]);

    /** Logs in the user and persists the resulting user to state and local storage. */
    async function login(email: string, password: string) {
        const response = await loginUser(email, password);
        const nextUser: User = {
            id: response.id,
            displayName: response.displayName ?? "",
            email: response.email,
            roles: response.roles ?? [],
            expiresAt: response.expiresAt,
        };
        persistUser(nextUser);
    }

    /** Registers a new user account. */
    async function register(email: string, password: string, displayName: string) {
        await registerUser(email, password, displayName);
    }

    /** Updates the current user's display name in state and local storage. */
    function updateDisplayName(displayName: string) {
        setUser((current) => {
            if (!current)
                return current;

            const nextUser = { ...current, displayName };
            localStorage.setItem("user", JSON.stringify(nextUser));
            return nextUser;
        });
    }

    const authContextType: AuthContextType = {
        user,
        isInitialized,
        login,
        logout,
        register,
        updateDisplayName,
        isLoggedIn: user !== null,
    };

    return (
        <AuthContext.Provider value={authContextType}>
            {children}
        </AuthContext.Provider>
    );
}
