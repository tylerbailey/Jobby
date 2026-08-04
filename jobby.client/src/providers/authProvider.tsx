import { AuthContext } from "@/context/authContext";
import { getStoredUser } from "@/helpers/authHelpers";
import { AUTH_UNAUTHORIZED_EVENT } from "@/helpers/authSession";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/services/authService";
import type { AuthContextType, User } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

/** Provides authentication state and actions to the rest of the app. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getStoredUser<User>());
    const [isInitialized, setIsInitialized] = useState(false);

    /** Clears the stored user from state and local storage. */
    const clearUser = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
    }, []);

    /** Logs out the current user and clears local session state. */
    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch {
            // cookie may already be gone
        }
        clearUser();
    }, [clearUser]);

    useEffect(() => {
        let cancelled = false;

        /** Loads the current user session on mount, clearing it if unauthorized. */
        async function initSession() {
            try {
                const currentUser = await getCurrentUser();
                if (cancelled)
                    return;

                setUser(currentUser);
                localStorage.setItem("user", JSON.stringify(currentUser));
            } catch (error) {
                if (!cancelled && axios.isAxiosError(error) && error.response?.status === 401)
                    clearUser();
            } finally {
                if (!cancelled)
                    setIsInitialized(true);
            }
        }

        initSession();
        return () => {
            cancelled = true;
        };
    }, [clearUser]);

    useEffect(() => {
        /** Clears the local session when an unauthorized event is received. */
        function onUnauthorized() {
            clearUser();
            void logoutUser().catch(() => {});
        }

        window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
        return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    }, [clearUser]);

    /** Logs in the user and persists the resulting user to state and local storage. */
    async function login(email: string, password: string) {
        const response = await loginUser(email, password);
        const nextUser: User = {
            id: response.id,
            displayName: response.displayName ?? "",
            email: response.email,
            roles: response.roles ?? [],
        };
        setUser(nextUser);
        localStorage.setItem("user", JSON.stringify(nextUser));
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
