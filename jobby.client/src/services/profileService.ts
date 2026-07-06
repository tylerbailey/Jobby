import { buildProfileStatsFromApplications } from "@/helpers/profileStatsHelpers";
import type { UpdateProfileRequest } from "@/types";
import { api } from "@/api";

export async function getProfileStats() {
    return buildProfileStatsFromApplications();
}

export async function updateProfile(request: UpdateProfileRequest) {
    const response = await api.put<{ displayName: string }>("/profile", request);
    return response.data;
}
