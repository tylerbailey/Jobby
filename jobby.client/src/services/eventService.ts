import type { EventItem } from "@/types";
import { api } from "@/api";

/** Creates a new event. */
export async function createEvent(event: EventItem) {
     await api.post(`/events/new`, event);
}

/** Fetches all events for the current user. */
export async function getUserEvents() {
    return await api.get<EventItem[]>("/events/get");
}

/** Deletes an event. */
export async function deleteEvent(event: EventItem) {
     await api.delete(`/events/delete/${event.id}`);
}

/** Fetches all events for a given application. */
export async function getEvents(appId: number) {
    return await api.get(`/events/${appId}`);
}

/** Fetches upcoming events for a given application. */
export async function getUpcomingEvents(appId: number) {
    return await api.get(`/events/upcoming/${appId}`);
}