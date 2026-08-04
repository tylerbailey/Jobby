import { useState, type Dispatch, type SetStateAction } from "react";
import StageForm from "./StageForm";
import type { Stage } from "@/types";
import { createStage } from "@/services/stageService";
import { Colors } from "@/consts/consts";
import { toast } from "sonner";

export type CreateStageProps = {
    onUpdate: () => void;
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
}
/** Renders the dialog for creating a new pipeline stage. */
export default function CreateStage({onUpdate, dialogOpen, setDialogOpen } : CreateStageProps) {
    const [stage, setStage] = useState<Stage>({
        id: null,
        order: 0,
        color: Colors.Gray,
        name: "",
        items: [],
    });

    /** Creates the new pipeline stage. */
    async function handleCreate() {
        await createStage(stage);
        setDialogOpen(false);
        onUpdate();
        toast.info("The stage was successfully created.");
    }

  return (
      <StageForm title="Create New Stage" stage={stage} setStage={setStage} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} action={handleCreate} />
  );
}
