import type { Dispatch, SetStateAction } from "react";

export type Application = {
    id?: number;
    userId?: string;
    companyName: string;
    title: string;
    postingUrl: string;
    locationTypeId: number;
    locationType?: string;
    address?: string;
    salary?: number;
    stageId?: number;
    appliedDate?: Date;
    upcomingDate?: Date;
    upcomingType?: string;
    contactName?: string;
    lastContactDate?: Date;
    nextContactDate?: Date;
    notes?: string;
}

export type ApplicationFormData = {
    formTitle: string;
    formDesc: string;
    companyName: string;
    title: string;
    postingUrl: string;
    locationTypeId: number;
    address?: string;
    salary?: number;
    stageId?: number;
    appliedDate?: Date;
    upcomingDate?: Date;
    upcomingType?: string;
    contactName?: string;
    lastContactDate?: Date;
    nextContactDate?: Date;
    notes?: string;   
}

export type AppCreateProps = {
    stage: number;
    onUpdate: () => void;
}

export type AppEditProps = {
    item: Application
    onUpdate: () => void;
}

export type LocationType = {
    id: number;
    type: string;
}

export type AppFormProps = {
    form: ApplicationFormData;
    action: () => void;
    setForm: Dispatch<SetStateAction<ApplicationFormData>>;
    icon: React.ReactNode;
    buttonText: string;
}