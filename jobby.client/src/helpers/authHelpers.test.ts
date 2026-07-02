import { describe, expect, it, vi, afterEach } from "vitest";
import {
    getAuthErrorMessage,
    hasFieldErrors,
    isTokenExpired,
    validateRegisterForm,
} from "@/helpers/authHelpers";

describe("validateRegisterForm", () => {
    it("returns no errors for valid input", () => {
        const errors = validateRegisterForm("Tyler", "tyler@example.com", "Password1");
        expect(hasFieldErrors(errors)).toBe(false);
    });

    it("requires display name", () => {
        const errors = validateRegisterForm("", "tyler@example.com", "Password1");
        expect(errors.displayName).toBeTruthy();
    });

    it("requires a valid email", () => {
        const errors = validateRegisterForm("Tyler", "not-an-email", "Password1");
        expect(errors.email).toBeTruthy();
    });

    it("enforces password rules", () => {
        const errors = validateRegisterForm("Tyler", "tyler@example.com", "short");
        expect(errors.password).toBeTruthy();
    });
});

describe("getAuthErrorMessage", () => {
    it("returns fallback for unknown errors", () => {
        expect(getAuthErrorMessage(new Error("boom"), "Fallback")).toBe("Fallback");
    });
});

describe("isTokenExpired", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns true for malformed tokens", () => {
        expect(isTokenExpired("not-a-jwt")).toBe(true);
    });

    it("returns false for a valid future token", () => {
        const futureExp = Math.floor(Date.now() / 1000) + 3600;
        const payload = btoa(JSON.stringify({ exp: futureExp }));
        const token = `header.${payload}.signature`;

        expect(isTokenExpired(token)).toBe(false);
    });

    it("returns true for an expired token", () => {
        const pastExp = Math.floor(Date.now() / 1000) - 3600;
        const payload = btoa(JSON.stringify({ exp: pastExp }));
        const token = `header.${payload}.signature`;

        expect(isTokenExpired(token)).toBe(true);
    });
});
