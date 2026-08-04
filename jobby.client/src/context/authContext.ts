import type { AuthContextType } from "@/types";
import { createContext, useContext } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);

/** Accesses the auth context, throwing if used outside of AuthProvider. */
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }

    return context;
}