export type HistoryItem = {
    appId: number;
    color: string
    eventTitle: string;
    eventDescription: string;
    eventDate: Date;
}

export type HistoryItems = {
    items: HistoryItem[];
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
}