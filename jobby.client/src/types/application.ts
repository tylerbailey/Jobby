import type { EventItem } from "./eventItem";

export type Application = {
    id: number;
    userId: string;
    companyName: string;
    jobTitle: string;
    summary: string;
    jobPostingUrl: string;
    locationTypeId: number;
    locationType: string;
    address: string;
    salary: number;
    contactName: string;
    stageId: number;
    notes: string;
    appliedDate?: Date;
    createdDate?: Date;
    status: number;
    isArchived: boolean;
    events: EventItem[];
}

export type AppLocationType = {
    id: number;
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
