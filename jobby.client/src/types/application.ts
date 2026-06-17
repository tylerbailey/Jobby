import type { EventItem } from "./eventItem";

export type Application = {
    id: number;
    userId: string;
    companyName: string;
    jobTitle: string;
    jobPostingUrl: string;
    locationTypeId: number;
    locationType: string;
    address: string;
    salary: number;
    contactName: string;
    stageId: number;
    notes: string;
    appliedDate?: Date;
    status: number;
    isArchived: boolean;
    events: EventItem[];
}

export type AppLocationType = {
    id: number;
    type: string;
}
