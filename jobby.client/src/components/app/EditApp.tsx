import AppForm from "@/components/app/AppForm";
import { updateApp } from "@/services/appService";
import type { Application } from "@/types/application";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export type AppEditProps = {
    cardItem: Application
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: () => void;
}
export function EditAppSheet({ cardItem, onUpdate, sheetOpen, setSheetOpen }: AppEditProps) { 
    const [item, setItem] = useState<Application>(cardItem);
   
    async function saveApp() {
        try {
            await updateApp(item);
            onUpdate();
            setSheetOpen(false);
        }
        catch {
            toast.error("An error occured editing the application.")
        }
    }

    return (
        <AppForm title="Edit Application" item={item} setItem={setItem} sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} action={saveApp} />
    );
}
