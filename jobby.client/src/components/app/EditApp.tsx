import { UpdateApp } from "@/services/appService";
import type { AppEditProps, ApplicationFormData } from "@/types";
import { useState } from "react";
import AppForm from "@/components/app/AppForm";
import { toast } from "sonner";

export function EditAppSheet({ item, onUpdate, sheetOpen ,setSheetOpen }: AppEditProps) {

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
        appliedDate: item.appliedDate,
    });
   
    async function saveApp() {
        try {
            await UpdateApp({
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
                isAccepted: item.isAccepted,
                isRejected: item.isRejected,
            });
            onUpdate();
            setSheetOpen(false);
        }
        catch (ex) {
            toast.error("An error occured editing the application.")
            throw ex;
        }
    }

    return (
        <AppForm form={form} setForm={setForm} sheetOpen={sheetOpen} setSheetOpen={ setSheetOpen } action={saveApp} />
    );
}
