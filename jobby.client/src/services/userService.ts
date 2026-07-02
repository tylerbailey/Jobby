import { api } from "@/api";
import type { AdminUser, UpdateAdminUserRequest, UpdateUserRolesRequest } from "@/types/adminUser";

export async function getAllUsers() {
    const response = await api.get<AdminUser[]>("/admin/users");
    return response.data;
}

export async function getAllRoles() {
    const response = await api.get<string[]>("/admin/roles");
    return response.data;
}

export async function updateUser(userId: string, request: UpdateAdminUserRequest) {
    const response = await api.put<AdminUser>(`/admin/users/${userId}`, request);
    return response.data;
}

export async function updateUserRoles(userId: string, request: UpdateUserRolesRequest) {
    const response = await api.put<AdminUser>(`/admin/users/${userId}/roles`, request);
    return response.data;
}

export async function deleteUser(userId: string) {
    await api.delete(`/admin/users/${userId}`);
}
