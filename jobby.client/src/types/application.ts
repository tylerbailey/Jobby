import type { Dispatch, SetStateAction } from "react";

export type Application = {
    id: number;
    userId: string;
    companyName: string;
    jobTitle: string;
    jobPostingUrl: string;
    locationTypeId: number;
    locationType: string;
    address: string;
    salary: number;
    contactName: string;
    stageId: number;
    notes: string;
    appliedDate?: Date;
    isAccepted: boolean;
    isRejected: boolean;
}

export type ApplicationFormData = {
    id: number;
    formTitle: string;
    formDesc: string;
    companyName: string;
    jobTitle: string;
    jobPostingUrl: string;
    locationTypeId: number;
    locationType: string;
    address: string;
    salary: number;
    contactName: string;
    stageId: number;
    notes: string;
    appliedDate?: Date;
}

export type AppInfoProps = {
    item: Application;
    infoOpen: boolean;
    setInfoOpen: Dispatch<SetStateAction<boolean>>
}

export type AppCreateProps = {
    stage: number;
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: () => void;
}

export type AppEditProps = {
    item: Application
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: () => void;
}

export type LocationType = {
    id: number;
    type: string;
}

export type AppFormProps = {
    form: ApplicationFormData;
    setForm: Dispatch<SetStateAction<ApplicationFormData>>;
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    action: () => void;
}