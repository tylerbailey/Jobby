import { api } from "@/api";
import type { Application, LocationType } from "@/types";

export async function CreateNewApp(application: Application) {
    return await api.post("/app/new", application);
}

export async function GetAllApps() {
    return await api.get<Application[]>("/app");
}

export async function GetAllAppLocations() {
    return await api.get<LocationType[]>("/app/locations");
}

export async function UpdateApp(application: Application) {
    return await api.post<Application>("/app/update", application)
}

export async function DeleteApp(appId: string) {
    return await api.delete(`/app/${appId}`);
}

export async function GenerateApp(
    file: File,
    appId: string
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