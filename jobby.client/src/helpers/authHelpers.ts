import axios from "axios";
import { jwtDecode } from "jwt-decode";

type IdentityError = {
    description?: string;
    Description?: string;
};

type ApiErrorBody = {
    message?: string;
    errors?: string[] | IdentityError[];
};

export function getAuthErrorMessage(error: unknown, fallback: string): string {
    if (!axios.isAxiosError(error))
        return fallback;

    const status = error.response?.status;
    const data = error.response?.data;

    if (typeof data === "string" && data.trim())
        return data;

    if (Array.isArray(data)) {
        const messages = data
            .map((entry) => (entry as IdentityError).description ?? (entry as IdentityError).Description)
            .filter(Boolean);

        if (messages.length > 0)
            return messages.join(" ");
    }

    if (data && typeof data === "object") {
        const body = data as ApiErrorBody;

        if (body.message)
            return body.message;

        if (Array.isArray(body.errors)) {
            const messages = body.errors
                .map((entry) =>
                    typeof entry === "string"
                        ? entry
                        : entry.description ?? entry.Description
                )
                .filter(Boolean);

            if (messages.length > 0)
                return messages.join(" ");
        }
    }

    if (status === 401)
        return "Invalid email or password.";

    if (status === 403)
        return "Your account is pending approval.";

    return fallback;
}

export type RegisterFieldErrors = {
    displayName?: string;
    email?: string;
    password?: string;
};

export function validateRegisterForm(
    displayName: string,
    email: string,
    password: string
): RegisterFieldErrors {
    const errors: RegisterFieldErrors = {};

    if (!displayName.trim())
        errors.displayName = "Display name is required.";

    if (!email.trim())
        errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.email = "Enter a valid email address.";

    if (!password)
        errors.password = "Password is required.";
    else if (password.length < 8)
        errors.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(password))
        errors.password = "Password must include an uppercase letter.";
    else if (!/[0-9]/.test(password))
        errors.password = "Password must include a number.";

    return errors;
}

export function hasFieldErrors(errors: RegisterFieldErrors): boolean {
    return Object.values(errors).some(Boolean);
}

type JwtPayload = {
    exp?: number;
};

export function isTokenExpired(token: string, skewSeconds = 30): boolean {
    try {
        const { exp } = jwtDecode<JwtPayload>(token);
        if (!exp)
            return true;

        return Date.now() >= (exp - skewSeconds) * 1000;
    } catch {
        return true;
    }
}

export function getStoredToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
        clearStoredAuth();
        return null;
    }

    return token;
}

export function getStoredUser<T>(): T | null {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser || isTokenExpired(token)) {
        clearStoredAuth();
        return null;
    }

    try {
        return JSON.parse(storedUser) as T;
    } catch {
        clearStoredAuth();
        return null;
    }
}

function clearStoredAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
