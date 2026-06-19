import { api } from "@/api";
import type { Recruiter } from "@/types/recruiter";

export async function createRecruiter(recruiter: Recruiter) {
    await api.post<Recruiter>("/recruiter/new", recruiter);
}

export async function getAllRecruiters() {
    return await api.get<Recruiter[]>("/recruiter/all");
}

export async function editRecruiter(recruiter: Recruiter) {
    await api.post("/recruiter/update", recruiter);
}

export async function deleteRecruiter(recruiterId: number) {
   await api.delete(`/recruiter/${recruiterId}`)
}