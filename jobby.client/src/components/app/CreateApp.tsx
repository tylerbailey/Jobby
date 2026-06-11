import { CreateNewApp } from "@/services/appService";
import type { AppCreateProps, ApplicationFormData } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import  AppForm  from "@/components/app/AppForm";

export default function CreateApp({ stage, onUpdate, sheetOpen, setSheetOpen }: AppCreateProps) {
    const [form, setForm] = useState<ApplicationFormData>({
        formTitle: "Create Application",
        formDesc: "Create a new application here. Click save when you're done.",
        companyName: "",
        title: "",
        postingUrl: "",
        locationTypeId: 0,
        address: "",
        salary: undefined,
        stageId: stage,
        appliedDate: undefined,
        upcomingDate: undefined,
        upcomingType: "",
        contactName: "",
        lastContactDate: undefined,
        nextContactDate: undefined,
        notes: ""
    });

    async function saveApp() {
        try {
            const payload = {
                companyName: form.companyName,
                title: form.title,
                postingUrl: form.postingUrl,
                locationTypeId: form.locationTypeId,
                address: form.address,
                salary: form.salary,
                stageId: stage,
                appliedDate: form.appliedDate,
                upcomingDate: form.upcomingDate,
                contactName: form.contactName,
                lastContactDate: form.lastContactDate,
                nextContactDate: form.nextContactDate,
                notes: form.notes
            };
            await CreateNewApp(payload);
            onUpdate();
            setSheetOpen(false);
            setForm({
                ...form,
                companyName: "",
                title: "",
                postingUrl: "",
                locationTypeId: 0,
                address: "",
                salary: undefined,
                stageId: 0,
                appliedDate: undefined,
                upcomingDate: undefined,
                upcomingType: "",
                contactName: "",
                lastContactDate: undefined,
                nextContactDate: undefined,
                notes: ""
            });

        }
        catch (ex) {
            toast.error("An error occured creating the application.")
            throw ex;
        }
    };

    return (
        <AppForm form={form} setForm={setForm} sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} action={saveApp} />
    );
}
