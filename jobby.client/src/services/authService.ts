import { api } from "@/api";
import type { AuthResponse } from "@/types";


export async function login(email: string, password: string) {
    const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password
    });

    localStorage.setItem("token", response.data.token);
    return response.data;
}

export async function register(
    email: string,
    password: string,
    displayName?: string
) {
    const response = await api.post<AuthResponse>("/auth/register", {
        email,
        password,
        displayName
    });

    localStorage.setItem("token", response.data.token);
    return response.data;
}

export function logout() {
    localStorage.removeItem("token");
}

export function isLoggedIn() {
    return Boolean(localStorage.getItem("token"));
}

