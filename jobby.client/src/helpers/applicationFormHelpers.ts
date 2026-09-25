import type { Application } from "@/types";

/** Character and numeric limits that match the job application columns. */
export const applicationFieldLimits = {
    companyName: 256,
    jobTitle: 256,
    summary: 2046,
    jobPostingUrl: 1024,
    address: 512,
    contactName: 256,
    notes: 2046,
    salary: 2_147_483_647,
} as const;

export type ApplicationFieldErrors = {
    companyName?: string;
    jobTitle?: string;
    summary?: string;
    jobPostingUrl?: string;
    locationTypeId?: string;
    address?: string;
    salary?: string;
    contactName?: string;
    notes?: string;
};

/** True when any application field has a validation message. */
export function hasApplicationFieldErrors(errors: ApplicationFieldErrors): boolean {
    return Object.values(errors).some(Boolean);
}

/** Validates a manually entered application against required fields and database limits. */
export function validateManualApplication(item: Application): ApplicationFieldErrors {
    const errors: ApplicationFieldErrors = {};
    const companyName = item.companyName ?? "";
    const jobTitle = item.jobTitle ?? "";

    if (!companyName.trim())
        errors.companyName = "Company name is required.";
    else if (companyName.length > applicationFieldLimits.companyName)
        errors.companyName = `Company name must be ${applicationFieldLimits.companyName} characters or fewer.`;

    if (!jobTitle.trim())
        errors.jobTitle = "Job title is required.";
    else if (jobTitle.length > applicationFieldLimits.jobTitle)
        errors.jobTitle = `Job title must be ${applicationFieldLimits.jobTitle} characters or fewer.`;

    if (!item.locationTypeId)
        errors.locationTypeId = "Location type is required.";

    const summaryError = lengthError(item.summary, applicationFieldLimits.summary, "Summary");
    if (summaryError)
        errors.summary = summaryError;

    const urlError = lengthError(item.jobPostingUrl, applicationFieldLimits.jobPostingUrl, "URL");
    if (urlError)
        errors.jobPostingUrl = urlError;

    const addressError = lengthError(item.address, applicationFieldLimits.address, "Address");
    if (addressError)
        errors.address = addressError;

    const contactError = lengthError(item.contactName, applicationFieldLimits.contactName, "Contact");
    if (contactError)
        errors.contactName = contactError;

    const notesError = lengthError(item.notes, applicationFieldLimits.notes, "Notes");
    if (notesError)
        errors.notes = notesError;

    if (item.salary != null && (!Number.isInteger(item.salary) || item.salary < 0 || item.salary > applicationFieldLimits.salary))
        errors.salary = "Salary must be a whole number up to 2,147,483,647.";

    return errors;
}

function lengthError(value: string | null | undefined, limit: number, label: string): string | undefined {
    if ((value ?? "").length > limit)
        return `${label} must be ${limit} characters or fewer.`;

    return undefined;
}
