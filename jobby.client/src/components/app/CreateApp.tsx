import AppForm from "@/components/app/AppForm";
import { Status } from "@/consts/consts";
import { createNewApp } from "@/services/appService";
import type { Application } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export type AppCreateProps = {
    stage: number;
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: () => void;
}

export default function CreateApp({ stage, onUpdate, sheetOpen, setSheetOpen }: AppCreateProps) {
    const [item, setItem] = useState<Application>({
        id: 0,
        userId: "",
        companyName: "",
        jobTitle: "",
        summary: "",
        jobPostingUrl: "",
        locationTypeId: 0,
        locationType: "",
        address: "",
        salary: 0,
        contactName: "",
        stageId: stage,
        notes: "",
        status: Status.InProgress,
        isArchived: false,
        appliedDate: undefined,
        events: []
    });

    async function saveApp() {
        try {

            await createNewApp(item);
            onUpdate();
            setSheetOpen(false);
            setItem({
                id: 0,
                userId: "",
                companyName: "",
                jobTitle: "",
                summary: "",
                jobPostingUrl: "",
                locationTypeId: 0,
                locationType: "",
                address: "",
                salary: 0,
                contactName: "",
                stageId: stage,
                notes: "",
                status: Status.InProgress,
                isArchived: false,
                appliedDate: undefined,
                events: []
            });

        }
        catch {
            toast.error("An error occured creating the application.")
        }
    };

    return (
        <AppForm
            title="Create Application"
            item={item}
            setItem={setItem}
            sheetOpen={sheetOpen}
            setSheetOpen={setSheetOpen}
            action={saveApp}
            allowScrape
        />
    );
}
