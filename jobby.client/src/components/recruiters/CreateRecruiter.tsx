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
/** Renders the dialog for creating a new recruiter contact. */
export default function CreateRecruiter({onUpdate, dialogOpen, setDialogOpen }: AddRecruiterProps){
    const emptyRecruiter = (): Recruiter => ({
        id: null,
        name: "",
        agency: "",
        email: "",
        lastContact: null,
        nextContact: null,
        notes: "",
        phoneNumber: "",
        applicationIds: [],
    });

    const [item, setItem] = useState<Recruiter>(emptyRecruiter)

    /** Creates the new recruiter and resets the form. */
    async function handleSave() {
        await createRecruiter(item);
        setDialogOpen(false);
        onUpdate();
        toast.info("Recruiter added.")
        setItem(emptyRecruiter())
    }

  return (
      <RecruiterForm title="Add New Recruiter" item={item} setItem={setItem} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} action={ handleSave } />
  );
}
