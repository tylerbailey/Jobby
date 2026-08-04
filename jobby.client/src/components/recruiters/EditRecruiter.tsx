import type { Recruiter } from "@/types";
import RecruiterForm from "./RecruiterForm";
import { useState, type Dispatch, type SetStateAction } from "react";
import { editRecruiter } from "@/services/recruiterService";

export type AddRecruiterProps = {
    onUpdate: () => void;
    formItem: Recruiter;
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
}
/** Renders the dialog for editing an existing recruiter contact. */
export default function EditRecruiter({ formItem, onUpdate, dialogOpen, setDialogOpen }: AddRecruiterProps) {
    const [item, setItem] = useState<Recruiter>(formItem);

    /** Saves the edited recruiter details. */
    async function handleEdit() {
        await editRecruiter(item)
        setDialogOpen(false);
        onUpdate();

    }

    return (
        <RecruiterForm title="Edit Recruiter" item={item} setItem={setItem} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} action={handleEdit} />
    );
}

