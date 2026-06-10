import { CreateNewApp } from "@/services/appService";
import type { AppCreateProps, ApplicationFormData } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import AppForm from "./AppForm";

export default function CreateApp({ stage, onUpdate }: AppCreateProps) {
    const [form, setForm] = useState<ApplicationFormData>({
        formTitle: "Create Application",
        formDesc: "Create a new application here. Click save when you're done.",
        companyName: "",
        title: "",
        postingUrl: "",
        locationTypeId: 0,
        address: "",
        salary: null,
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
            setForm({
                ...form,
                companyName: "",
                title: "",
                postingUrl: "",
                locationTypeId: 0,
                address: "",
                salary: null,
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
        }
    };

    return (
        <AppForm form={form} action={saveApp} setForm={setForm} icon={<Plus className="h-4 w-4" />} buttonText={"Create"} />
    );
}
