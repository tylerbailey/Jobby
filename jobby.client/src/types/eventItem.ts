import type { Application } from "./application";

export type EventItem = {
    id?: number;
    appId: number;
    eventTitle: string;
    eventDescription: string;
    eventDate: Date;
    application?: Application;
}
export type AddEventProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onUpdate: ()=> void;
}

export type EventInfoProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    eventItem: EventItem;
    onUpdate: () => void;
}