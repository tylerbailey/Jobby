import type { EventItem } from "@/types";
import { api } from "@/api";

export async function CreateEvent(event: EventItem) {
    return await api.post(`/event/new`, event);
}

export async function GetUserEvents() {
    return await api.get<EventItem[]>("/event/get");
}

export async function DeleteEvent(event: EventItem) {
    return await api.delete(`/event/delete/${event.id}`);
}
