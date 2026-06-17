import AppForm, { type ApplicationFormData } from "@/components/app/AppForm";
import { createNewApp } from "@/services/appService";
import type { Application } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { Status } from "../../enum/enums";

export type AppCreateProps = {
    stage: number;
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: () => void;
}

export default function CreateApp({ stage, onUpdate, sheetOpen, setSheetOpen }: AppCreateProps) {
    const [form, setForm] = useState<ApplicationFormData>({
        id: 0,
        formTitle: "Create Application",
        formDesc: "Create a new application here. Click save when you're done.",
        companyName: "",
        jobTitle: "",
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
            const payload: Application = {
                id: form.id,
                userId: "",                
                companyName: form.companyName,
                jobTitle: form.jobTitle,
                jobPostingUrl: form.jobPostingUrl,
                locationTypeId: form.locationTypeId,
                locationType: form.locationType,
                address: form.address,
                salary: form.salary,
                contactName: form.contactName,
                stageId: stage,
                notes: form.notes,
                appliedDate: form.appliedDate,
                status: form.status,
                isArchived: form.isArchived,
                events : form.events
            };
            await createNewApp(payload);
            onUpdate();
            setSheetOpen(false);
            setForm({
                ...form,
                companyName: "",
                jobTitle: "",
                jobPostingUrl: "",
                locationTypeId: 0,
                locationType: "",
                address: "",
                salary: 0,
                contactName: "",
                stageId: stage,
                notes: "",
                appliedDate: undefined,
              events: []
            });

        }
        catch {
            toast.error("An error occured creating the application.")        
        }
    };

    return (
        <AppForm form={form} setForm={setForm} sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} action={saveApp} />
    );
}
