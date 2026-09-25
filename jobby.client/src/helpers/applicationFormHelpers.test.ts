import { describe, expect, it } from "vitest";
import {
    applicationFieldLimits,
    hasApplicationFieldErrors,
    validateManualApplication,
} from "@/helpers/applicationFormHelpers";
import type { Application } from "@/types";

function application(overrides: Partial<Application> = {}): Application {
    return {
        userId: "",
        companyName: "Optomi",
        jobTitle: ".NET Developer",
        summary: "",
        jobPostingUrl: "",
        locationTypeId: 1,
        locationType: "Remote",
        address: "",
        salary: null,
        contactName: "",
        notes: "",
        status: 0,
        isArchived: false,
        events: [],
        recruiter: {
            id: 0,
            name: "",
            agency: "",
            notes: "",
            email: "",
            phoneNumber: "",
            lastContact: null,
            nextContact: null,
            applicationIds: [],
        },
        ...overrides,
    };
}

describe("validateManualApplication", () => {
    it("accepts a complete application", () => {
        const errors = validateManualApplication(application());
        expect(hasApplicationFieldErrors(errors)).toBe(false);
    });

    it("requires a location type", () => {
        const errors = validateManualApplication(application({ locationTypeId: 0 }));
        expect(errors.locationTypeId).toBe("Location type is required.");
    });

    it("requires company name and job title", () => {
        const errors = validateManualApplication(application({ companyName: "  ", jobTitle: "" }));
        expect(errors.companyName).toBeTruthy();
        expect(errors.jobTitle).toBeTruthy();
    });

    it("rejects values longer than the database columns", () => {
        const errors = validateManualApplication(application({
            companyName: "a".repeat(applicationFieldLimits.companyName + 1),
            notes: "b".repeat(applicationFieldLimits.notes + 1),
        }));
        expect(errors.companyName).toMatch(/256/);
        expect(errors.notes).toMatch(/2046/);
    });
});
