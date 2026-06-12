export type EventItem = {
    id?: number;
    appId: number;
    eventTitle: string;
    eventDescription: string;
    eventDate: Date;
}

export type EventFormData = {
    id?: number;
    appId: number;
    eventTitle: string;
    eventDescription: string;
    eventDate: Date;
}

export type EventFormProps = {
    event: EventFormData;
}