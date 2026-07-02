import type { Recruiter } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import { createRecruiter } from "@/services/recruiterService";
import RecruiterForm from "./RecruiterForm";

export type AddRecruiterProps = {
    onUpdate: () => void;
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
}
export default function CreateRecruiter({onUpdate, dialogOpen, setDialogOpen }: AddRecruiterProps){
    const [item, setItem] = useState<Recruiter>({
        name: "",
        agency: "",
        email: "",
        lastContact: undefined,
        nextContact: undefined,
        notes: "",
        phoneNumber: "",
    })

    async function handleSave() {
        console.log(item)
        await createRecruiter(item);
        setDialogOpen(false);
        onUpdate();
        toast.info("Recruiter added.")
        setItem({
            name: "",
            agency: "",
            email: "",
            lastContact: undefined,
            nextContact: undefined,
            notes: "",
            phoneNumber: "",
        })
    }

  return (
      <RecruiterForm title="Add New Recruiter" item={item} setItem={setItem} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} action={ handleSave } />
  );
}
