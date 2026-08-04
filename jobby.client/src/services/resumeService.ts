import { api } from "@/api";
import type { ResumeAnalysisResponse } from "@/types";

/** Uploads a resume file for ATS review and scoring. */
export async function rateResume(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<ResumeAnalysisResponse>(
        "/resume/review",
        formData,
        { timeout: 600_000 },
    );

    return response.data;
}