export type Recruiter = {
    id?: number;
    name: string;
    agency: string;
    notes: string;
    email: string;
    phoneNumber: string;
    lastContact?: Date;
    nextContact?: Date;
}