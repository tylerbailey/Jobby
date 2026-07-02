import type { User } from "@/types";

export type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName: string) => Promise<void>;
    logout: () => void;
    isLoggedIn: boolean;
};

export type AuthResponse = {
    token: string;
    id: string;
    email: string;
    displayName?: string;
    roles: string[];
};