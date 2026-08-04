import { buildProfileStatsFromApplications } from "@/helpers/profileStatsHelpers";
import type { UpdateProfileRequest } from "@/types";
import { api } from "@/api";

/** Builds profile statistics from the user's applications. */
export async function getProfileStats() {
    return buildProfileStatsFromApplications();
}

/** Updates the current user's profile. */
export async function updateProfile(request: UpdateProfileRequest) {
    const response = await api.put<{ displayName: string }>("/profile", request);
    return response.data;
}
