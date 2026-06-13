import { api } from "@/api";
import type { Application, EventItem, LocationType } from "@/types";

export async function CreateNewApp(application: Application) {
    return await api.post("/app/new", application);
}

export async function GetAllApps() {
    return await api.get<Application[]>("/app/all")
}

export async function GetAllAppLocations() {
    return await api.get<LocationType[]>("/app/locations");
}

export async function UpdateApp(application: Application) {
    return await api.post<Application>("/app/update", application)
}

export async function MoveStage(applicationId: number, stageId: number) {
    await api.post(`/app/move/${applicationId}?stageId=${stageId}`);
}

export async function DeleteApp(appId: string) {
    return await api.delete(`/app/${appId}`);
}

export async function GetEvents(appId: number): Promise<{
    data: EventItem[];}> {
    return await api.get(`/app/events/${appId}`);
}

export async function GetUpcomingEvents(appId: number)
{
    return await api.get(`/app/events/upcoming/${appId}`);
}

export async function GenerateApp(
    file: File,
    appId: number
) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        `/app/gen/${appId}`,
        formData,
        {
            responseType: "blob"
        }
    );

    return response.data;
}