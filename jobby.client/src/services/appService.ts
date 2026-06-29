import { api } from "@/api";
import type { Application, AppLocationType } from "@/types";

export async function createNewApp(application: Application) {
    return await api.post("/app/new", application);
}

export async function getAllApps() {
    return await api.get<Application[]>("/app/all")
}

export async function getAllAppLocations() {
    return await api.get<AppLocationType[]>("/app/locations");
}

export async function getArchivedApps() {
    return await api.get<Application[]>("/app/archive")
}

export async function updateApp(application: Application) {
    return await api.post<Application>("/app/update", application)
}

export async function moveAppStage(applicationId: number, stageId: number) {
    await api.post(`/app/move/${applicationId}?stageId=${stageId}`);
}

export async function deleteApp(appId: number) {
    return await api.delete(`/app/${appId}`);
}

export async function generateApp(file: File, posting: string) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("posting", posting)
    const response = await api.post(
        `/app/gen/${appId}`,
        formData,
        {
            responseType: "blob"
        }
    );

    return response.data;
}