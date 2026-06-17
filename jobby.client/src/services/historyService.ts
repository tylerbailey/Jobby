import { api } from "@/api";

export async function getHistory(applicationId: number) {
    return await api.get("/history/" + applicationId)
}