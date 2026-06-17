import type { EventItem } from "@/types";
import { api } from "@/api";

export async function createEvent(event: EventItem) {
     await api.post(`/events/new`, event);
}

export async function getUserEvents() {
    return await api.get<EventItem[]>("/events/get");
}

export async function deleteEvent(event: EventItem) {
     await api.delete(`/events/delete/${event.id}`);
}

export async function getEvents(appId: number) {
    return await api.get(`/events/${appId}`);
}

export async function getUpcomingEvents(appId: number) {
    return await api.get(`/events/upcoming/${appId}`);
}