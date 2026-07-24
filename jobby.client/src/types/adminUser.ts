export type AdminUser = {
    id: string;
    email: string;
    displayName?: string | null;
    isApproved: boolean;
    emailConfirmed: boolean;
    lockoutEnabled: boolean;
    lockoutEnd?: string | null;
    roles: string[];
};

export type UpdateAdminUserRequest = {
    email?: string;
    displayName?: string | null;
    isApproved?: boolean;
    emailConfirmed?: boolean;
    lockoutEnabled?: boolean;
    password?: string;
};

export type UpdateUserRolesRequest = {
    roles: string[];
};
