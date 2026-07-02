import { AuthContext } from "@/context/authContext";
import { AUTH_UNAUTHORIZED_EVENT } from "@/helpers/authSession";
import { getStoredToken, getStoredUser, isTokenExpired } from "@/helpers/authHelpers";
import { getCurrentUser, loginUser, registerUser } from "@/services/authService";
import type { AuthContextType, User } from "@/types";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

const SESSION_CHECK_INTERVAL_MS = 30_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => getStoredToken());
    const [user, setUser] = useState<User | null>(() => getStoredUser<User>());

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    }, []);

    useEffect(() => {
        function onUnauthorized() {
            setUser(null);
            setToken(null);
        }

        window.addEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
        return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, onUnauthorized);
    }, []);

    useEffect(() => {
        if (!token)
            return;

        if (isTokenExpired(token)) {
            logout();
            return;
        }

        const intervalId = window.setInterval(() => {
            const currentToken = localStorage.getItem("token");
            if (!currentToken || isTokenExpired(currentToken)) {
                logout();
                window.location.assign("/login");
            }
        }, SESSION_CHECK_INTERVAL_MS);

        return () => window.clearInterval(intervalId);
    }, [token, logout]);

    useEffect(() => {
        if (!token)
            return;

        let cancelled = false;

        async function validateSession() {
            try {
                const currentUser = await getCurrentUser();
                if (cancelled)
                    return;

                setUser(currentUser);
                localStorage.setItem("user", JSON.stringify(currentUser));
            } catch (error) {
                if (!cancelled && axios.isAxiosError(error) && error.response?.status === 401)
                    logout();
            }
        }

        validateSession();
        return () => {
            cancelled = true;
        };
    }, [token, logout]);

    async function login(email: string, password: string) {
        const response = await loginUser(email, password);
        const nextUser: User = {
            id: response.id,
            displayName: response.displayName ?? "",
            email: response.email,
            roles: response.roles ?? [],
        };
        setToken(response.token);
        setUser(nextUser);
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(nextUser));
    }

    async function register(email: string, password: string, displayName: string) {
        await registerUser(email, password, displayName);
    }

    const isLoggedIn = useMemo(
        () => token !== null && !isTokenExpired(token),
        [token],
    );

    const authContextType: AuthContextType = {
        user,
        token,
        login,
        logout,
        register,
        isLoggedIn,
    };

    return (
        <AuthContext.Provider value={authContextType}>
            {children}
        </AuthContext.Provider>
    );
}
