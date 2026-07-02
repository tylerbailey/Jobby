import { AuthContext } from "@/context/authContext";
import { loginUser, registerUser } from "@/services/authService";
import type { AuthContextType, User } from "@/types";
import { useState } from "react";


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem("token")
    );

    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");

        return storedUser
            ? JSON.parse(storedUser)
            : null;
    });

    async function login(email: string, password: string) {
        const response = await loginUser(email, password);
        const user: User = {
            id: response.id,
            displayName: response.displayName ?? "",
            email: response.email,
            roles: response.roles ?? [],
        };
        setToken(response.token);
        setUser(user)
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(user))
    };

    async function register(email: string, password: string, displayName: string) {
        await registerUser(email, password, displayName)
    };

     function logout() {
         localStorage.removeItem("token");
         localStorage.removeItem("user")
         setUser(null);
         setToken(null);
    };

    const authContextType: AuthContextType = {
        user,
        token,
        login,
        logout,
        register,
        isLoggedIn: !!token,
    };

    return (
        <AuthContext.Provider value={ authContextType }>
            {children}
        </AuthContext.Provider>
    );
}
