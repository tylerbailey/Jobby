import { UpdateApp } from "@/services/appService";
import type { AppEditProps, ApplicationFormData } from "@/types";
import { useState } from "react";
import AppForm from "@/components/app/AppForm";
import { toast } from "sonner";

export function EditAppSheet({ item, onUpdate, sheetOpen ,setSheetOpen }: AppEditProps) {

    const [form, setForm] = useState<ApplicationFormData>({
        formTitle: "Edit Application",
        formDesc: "Make changes to the application here. Click save when you're done.",
        companyName: item.companyName,
        title: item.title,
        postingUrl: item.postingUrl,
        locationTypeId: item.locationTypeId,
        address: item.address,
        salary: item.salary,
        stageId: item.stageId,
        appliedDate: item.appliedDate,
        upcomingDate: item.upcomingDate,
        upcomingType: item.upcomingType,
        contactName: item.contactName,
        lastContactDate: item.lastContactDate,
        nextContactDate: item.nextContactDate,
        notes: item.notes
    });
   
    async function saveApp() {
        try {
            await UpdateApp({
                id: item.id,
                userId: item.userId,
                companyName: form.companyName,
                title: form.title,
                postingUrl: form.postingUrl,
                locationTypeId: form.locationTypeId,
                address: form.address,
                salary: form.salary,
                stageId: item.stageId,
                appliedDate: form.appliedDate,
                upcomingDate: form.upcomingDate,
                contactName: form.contactName,
                lastContactDate: form.lastContactDate,
                nextContactDate: form.nextContactDate,
                notes: form.notes
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
