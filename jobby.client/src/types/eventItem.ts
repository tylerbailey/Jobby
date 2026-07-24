import type { Application } from "./application";

export type EventItem = {
    id?: number | null;
    appId?: number | null;
    recruiterId?: number | null;
    eventTitle: string;
    eventDescription: string;
    eventDate: string | Date;
    application?: Application;
}
