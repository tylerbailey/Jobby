import { AuthContext } from "@/context/authContext";
import { getStoredUser } from "@/helpers/authHelpers";
import { AUTH_UNAUTHORIZED_EVENT } from "@/helpers/authSession";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "@/services/authService";
import type { AuthContextType, User } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => getStoredUser<User>());
    const [isInitialized, setIsInitialized] = useState(false);

    const clearUser = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
    }, []);

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
        function onUnauthorized() {
            clearUser();
            void logoutUser().catch(() => {});
        }

        window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
        return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    }, [clearUser]);

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

    async function register(email: string, password: string, displayName: string) {
        await registerUser(email, password, displayName);
    }

    const authContextType: AuthContextType = {
        user,
        isInitialized,
        login,
        logout,
        register,
        isLoggedIn: user !== null,
    };

    return (
        <AuthContext.Provider value={authContextType}>
            {children}
        </AuthContext.Provider>
    );
}
