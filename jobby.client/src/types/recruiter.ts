export type Recruiter = {
    id?: number | null;
    name: string;
    agency: string;
    notes: string;
    email: string;
    phoneNumber: string;
    lastContact?: string | Date | null;
    nextContact?: string | Date | null;
    applicationIds: number[];
}
