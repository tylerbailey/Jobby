import { updateApp } from "@/services/appService";
import { useState, type Dispatch, type SetStateAction } from "react";
import AppForm, { type ApplicationFormData } from "@/components/app/AppForm";
import { toast } from "sonner";
import type { Application } from "@/types/application";

export type AppEditProps = {
    item: Application
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: () => void;
}
export function EditAppSheet({ item, onUpdate, sheetOpen, setSheetOpen }: AppEditProps) { 
    const [form, setForm] = useState<ApplicationFormData>({
        id: item.id,
        formTitle: "Edit Application",
        formDesc: "Make changes to the application here. Click save when you're done.",
        companyName: item.companyName,
        jobTitle: item.jobTitle,
        jobPostingUrl: item.jobPostingUrl,
        locationTypeId: item.locationTypeId,
        locationType: item.locationType,
        address: item.address,
        salary: item.salary,
        contactName: item.contactName,
        stageId: item.stageId,
        notes: item.notes,
        status: item.status,
        isArchived: item.isArchived,
        appliedDate: item.appliedDate,
        events: item.events ?? []
    });
   
    async function saveApp() {
        try {
            await updateApp({
                id: form.id,
                userId: item.userId,
                companyName: form.companyName,
                jobTitle: form.jobTitle,
                jobPostingUrl: form.jobPostingUrl,
                locationTypeId: form.locationTypeId,
                locationType: form.locationType,
                address: form.address,
                salary: form.salary,
                contactName: form.contactName,
                stageId: item.stageId,
                notes: form.notes,
                appliedDate: form.appliedDate,
                status: form.status,
                isArchived: form.isArchived,
                events: form.events
            });
            onUpdate();
            setSheetOpen(false);
        }
        catch {
            toast.error("An error occured editing the application.")
        }
    }

    return (
        <AppForm form={form} setForm={setForm} sheetOpen={sheetOpen} setSheetOpen={ setSheetOpen } action={saveApp} />
    );
}
