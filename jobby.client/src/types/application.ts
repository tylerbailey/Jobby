export type Application = {
    id?: string;
    userId: string;
    companyName: string;
    title: string;
    postingUrl: string;
    locationTypeId: number;
    locationType: string;
    address?: string;
    salary?: number;
    stageId?: number;
    appliedDate?: Date;
    upcomingDate?: Date;
    upcomingType?: string;
    notes?: string;
}

export type AppCreateProps = {
    stage: number;
    onUpdate: () => void;
}

export type LocationType = {
    id: number;
    type: string;
}