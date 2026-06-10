import { UpdateApp } from "@/services/appService";
import type { AppEditProps, ApplicationFormData } from "@/types";
import { Pencil } from "lucide-react";
import { useState } from "react";
import AppForm from "./AppForm";

export function EditAppSheet({ item, onUpdate }: AppEditProps) {

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
           appliedDate:  form.appliedDate,
           upcomingDate: form.upcomingDate,
           contactName: form.contactName,
           lastContactDate: form.lastContactDate,
           nextContactDate: form.nextContactDate,
           notes: form.notes
       });
       onUpdate();      
    }

    return (
        <AppForm form={form} action={saveApp} setForm={setForm} icon={<Pencil className="h-4 w-4" />} buttonText={"Edit"}  />
    );
}

