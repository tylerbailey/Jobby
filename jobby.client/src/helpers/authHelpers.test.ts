import { describe, expect, it } from "vitest";
import {
    getAuthErrorMessage,
    hasFieldErrors,
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
