import { AuthContext } from "@/context/authContext";
import type { User } from "@/types";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!stored || !token) return null;

        // Check if token is expired
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            return null;
        }

        return JSON.parse(stored);
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}
