import { api } from "@/api";

export async function GetHistory(applicationId: number) {
    return await api.get("/history/" + applicationId)
}