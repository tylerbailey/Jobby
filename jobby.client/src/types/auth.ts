import type { User } from "@/types";

export type AuthContextType = {
    user: User | null;
    isInitialized: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => void;
    updateDisplayName: (displayName: string) => void;
    isLoggedIn: boolean;
};

export type AuthResponse = {
    id: string;
    email: string;
    displayName?: string;
    roles: string[];
};