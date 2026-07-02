import { api } from "@/api";
import type { Application, AppLocationType } from "@/types";
import type { ResumeGenerationResponse } from "@/types/resume";

export async function createNewApp(application: Application) {
    return await api.post("/app/new", application);
}

export async function getAllApps() {
    return await api.get<Application[]>("/app/all");
}

export async function getAllAppLocations() {
    return await api.get<AppLocationType[]>("/app/locations");
}

export async function getArchivedApps() {
    return await api.get<Application[]>("/app/archive");
}

export async function updateApp(application: Application) {
    return await api.post<Application>("/app/update", application);
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
    formData.append("posting", posting);
    const response = await api.post<ResumeGenerationResponse>(
        "/app/gen",
        formData,
        { timeout: 600_000 },
    );

    return response.data;
}

export function downloadTailoredResume(documentBase64: string) {
    const binary = atob(documentBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob(
        [bytes],
        { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    );
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "TailoredResume.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
}