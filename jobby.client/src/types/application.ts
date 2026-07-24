import type { EventItem } from "./eventItem";
import type { Recruiter } from "./recruiter";

export type Application = {
    id?: number | null;
    userId: string;
    companyName: string;
    jobTitle: string;
    summary: string;
    jobPostingUrl: string;
    locationTypeId: number;
    locationType: string;
    address?: string | null;
    salary?: number | null;
    contactName?: string | null;
    stageId?: number | null;
    notes?: string | null;
    appliedDate?: string | Date | null;
    createdDate?: string | Date | null;
    status: number;
    isArchived: boolean;
    events: EventItem[];
    recruiter: Recruiter;
}

export type AppLocationType = {
    id?: number | null;
    type: string;
}

export type JobPostingData = {
    company: string;
    title: string;
    summary: string;
    isRemote: boolean;
    isHybrid: boolean;
    isOnsite: boolean;
    salaryRange: string;
    requiredSkills: string[];
    preferredSkills: string[];
    technologies: string[];
    responsibilities: string[];
    leadershipRequirements: string[];
    experienceRequirements: string[];
    keywords: string[];
}
