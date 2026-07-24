export type HistoryItem = {
    id?: number | null;
    appId: number;
    color: string;
    eventTitle: string;
    eventDescription: string;
    eventDate: string | Date;
}
