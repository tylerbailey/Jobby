import type { Application } from "./application";

export type EventItem = {
    id?: number;
    appId: number;
    recruiterId?: number;
    eventTitle: string;
    eventDescription: string;
    eventDate: Date;
    application?: Application;
}