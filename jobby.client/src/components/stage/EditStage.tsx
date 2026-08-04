import type { Stage } from "@/types";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import StageForm from "./StageForm";
import { updateStage } from "@/services/stageService";

export type EditStageProps = {
    stage: Stage;
    onUpdate: () => void;
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
}
/** Renders the dialog for editing an existing pipeline stage. */
export default function EditStage({ stage, onUpdate, dialogOpen, setDialogOpen }: EditStageProps) {
    const [formStage, setFormStage] = useState<Stage>(stage);

    useEffect(() => {
        /** Resets the form to the current stage whenever the dialog opens. */
        function formDetails() {
        if (dialogOpen)
                setFormStage(stage);
        }
        formDetails();
    }, [dialogOpen, stage]);

    /** Saves the edited pipeline stage. */
    async function handleEdit() {
        await updateStage(formStage);
        setDialogOpen(false);
        onUpdate();
        toast.info("The stage was successfully updated.");
    }

    return (
        <StageForm title="Edit Stage" stage={formStage} setStage={setFormStage} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} action={handleEdit} />
    );
}