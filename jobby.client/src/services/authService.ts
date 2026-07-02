import { api } from "@/api";
import type { AuthResponse } from "@/types";
import type { User } from "@/types";

export type RegisterResponse = {
    message: string;
};

export async function loginUser(email: string, password: string) {
    const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
    });
    return response.data;
}

export async function registerUser(
    email: string,
    password: string,
    displayName?: string
) {
    const response = await api.post<RegisterResponse>("/auth/register", {
        email,
        password,
        displayName,
    });
    return response.data;
}

export async function getCurrentUser() {
    const response = await api.get<User>("/auth/user");
    return response.data;
}
