import { api } from "@/api";
import type { Application, AppLocationType, JobPostingData } from "@/types";
import type { ResumeGenerationResponse } from "@/types/resume";

/** Creates a new application record. */
export async function createNewApp(application: Application) {
    return await api.post("/app/new", application);
}

/** Fetches all active applications for the current user. */
export async function getAllApps() {
    return await api.get<Application[]>("/app/all");
}

/** Fetches the list of available application location types. */
export async function getAllAppLocations() {
    return await api.get<AppLocationType[]>("/app/locations");
}

/** Fetches all archived applications for the current user. */
export async function getArchivedApps() {
    return await api.get<Application[]>("/app/archive");
}

/** Updates an existing application record. */
export async function updateApp(application: Application) {
    return await api.post<Application>("/app/update", application);
}

/** Moves an application to a different pipeline stage. */
export async function moveAppStage(applicationId: number, stageId: number) {
    await api.post(`/app/move/${applicationId}?stageId=${stageId}`);
}

/** Deletes an application by id. */
export async function deleteApp(appId: number) {
    return await api.delete(`/app/${appId}`);
}

/** Scrapes job posting details from the given URL. */
export async function scrapeJobPosting(url: string) {
    const response = await api.post<JobPostingData>(
        "/app/scrape-posting",
        { url },
        { timeout: 300_000 },
    );
    return response.data;
}

/** Generates a tailored resume and application from a resume file and job posting. */
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

/** Decodes a base64-encoded document and triggers a browser download of the tailored resume. */
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