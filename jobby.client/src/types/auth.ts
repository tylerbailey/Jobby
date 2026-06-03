import type { User } from "@/types";

export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export type AuthResponse = {
    token: string;
    id: string;
    email: string;
    displayName?: string;
};