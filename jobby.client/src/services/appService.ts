import { api } from "../api";
import type { Application, LocationType, Stage } from "@/types";

export async function CreateNewApp(application: Application) {
    return await api.post("/app/new", application);
}

export async function GetAllApps() {
    return await api.get<Application[]>("/app");
}

export async function GetAllStages() {
    return await api.get<Stage[]>("/app/pipeline");
}

export async function GetAllAppLocations() {
    return await api.get<LocationType[]>("/app/locations");
}

export async function UpdateAppStage(application: Application) {
    return await api.post<Application>("/app/update", application)
}