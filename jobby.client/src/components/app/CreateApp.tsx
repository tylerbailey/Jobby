import AppForm from "@/components/app/AppForm";
import { CreateNewApp } from "@/services/appService";
import type { AppCreateProps, Application, ApplicationFormData } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Status } from "../../enum/enums";

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
                status: Status.InProgress,
                isArchived: false,
                events : form.events
            };
            await CreateNewApp(payload);
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
