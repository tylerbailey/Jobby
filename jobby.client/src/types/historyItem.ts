import type { Dispatch, SetStateAction } from "react";

export type HistoryItem = {
    appId: number;
    color: string
    eventTitle: string;
    eventDescription: string;
    eventDate: Date;
}