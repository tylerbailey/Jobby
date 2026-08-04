import { api } from "@/api";
import type { Recruiter } from "@/types/recruiter";

/** Creates a new recruiter record. */
export async function createRecruiter(recruiter: Recruiter) {
    await api.post<Recruiter>("/recruiter/new", recruiter);
}

/** Fetches all recruiters. */
export async function getAllRecruiters() {
    return await api.get<Recruiter[]>("/recruiter/all");
}

/** Updates an existing recruiter record. */
export async function editRecruiter(recruiter: Recruiter) {
    await api.post("/recruiter/update", recruiter);
}

/** Deletes a recruiter by id. */
export async function deleteRecruiter(recruiterId: number) {
    await api.delete(`/recruiter/${recruiterId}`);
}