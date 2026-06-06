import type { AuthContextType } from "@/types";
import { createContext, useContext } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);

export function useUser() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useUser must be used within an AuthProvider");
    return context;
}