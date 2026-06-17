import type { EventItem } from "@/types";
import { api } from "@/api";

export async function CreateEvent(event: EventItem) {
     await api.post(`/events/new`, event);
}

export async function GetUserEvents() {
    return await api.get<EventItem[]>("/events/get");
}

export async function DeleteEvent(event: EventItem) {
     await api.delete(`/events/delete/${event.id}`);
}

export async function GetEvents(appId: number) {
    return await api.get(`/events/${appId}`);
}

export async function GetUpcomingEvents(appId: number) {
    return await api.get(`/events/upcoming/${appId}`);
}