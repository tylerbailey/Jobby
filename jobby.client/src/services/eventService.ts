import type { eventItem } from "@/types";
import { api } from "@/api";

export async function CreateEvent(event: eventItem) {
    return await api.post(`/app/event/new`, event);
}
