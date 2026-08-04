import { api } from "@/api";

/** Fetches the history entries for a given application. */
export async function getHistory(applicationId: number) {
    return await api.get("/history/" + applicationId)
}