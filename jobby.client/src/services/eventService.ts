import type { EventItem } from "@/types";
import { api } from "@/api";

export async function CreateEvent(event: EventItem) {
     await api.post(`/event/new`, event);
}

export async function GetUserEvents() {
    return await api.get<EventItem[]>("/event/get");
}

export async function DeleteEvent(event: EventItem) {
     await api.delete(`/event/delete/${event.id}`);
}
