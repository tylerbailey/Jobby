import { api } from "@/api";
import type { ResumeAnalysisResponse } from "../types";

export async function rateResume(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post<ResumeAnalysisResponse>(
        `/resume/review/`,
        formData
    );

    return response.data;
}