export type User = {
    id: string;
    email: string;
    displayName?: string | null;
    roles: string[];
    /** ISO-8601 UTC timestamp when the auth cookie/JWT expires. */
    expiresAt?: string | null;
};
