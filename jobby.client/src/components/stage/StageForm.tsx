import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Colors, ElementColors, FocusColors, HoverColors } from "@/consts/consts";
import type { Stage } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";

export type StageFormProps = {
    title: string;
    stage: Stage;
    setStage: Dispatch<SetStateAction<Stage>>
    dialogOpen: boolean;
    setDialogOpen: Dispatch<SetStateAction<boolean>>
    action: () => void;
}
function StageForm({ title, stage, setStage, dialogOpen, setDialogOpen, action }: StageFormProps) {
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    function handleColorChange(selectedColor: string) {
        setStage({ ... stage, color: selectedColor })
        setPopoverOpen(false);
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-stage-name">Name</FieldLabel>
                    <FieldDescription>
                        The name of the pipeline stage.
                    </FieldDescription>
                    <Input
                        id="input-stage-name"
                        type="text"
                        placeholder="Enter the stage name"
                        value={stage.name}
                        onChange={(e) => setStage({ ...stage, name: e.target.value })} />
                </Field>
                <Field className="py-3">
                    <FieldLabel>Color</FieldLabel>
                    <FieldDescription>
                        The color used to display the stage.
                    </FieldDescription>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <span className=""> <Button variant="outline" className={`w-full ${FocusColors[stage.color as keyof typeof FocusColors]} ${HoverColors[stage.color as keyof typeof HoverColors]} ${ElementColors[stage.color as keyof typeof ElementColors]}`}>{stage.color}</Button></span>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="center" side="top">
                            <div className="grid grid-cols-3 gap-4">
                                {Object.entries(Colors).map(([label]) => (
                                    <Button onClick={() => handleColorChange(label)} variant="outline" className={`max-w-25 ${HoverColors[label as keyof typeof HoverColors]} ${ElementColors[label as keyof typeof ElementColors]}`}>
                                        {label}
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </Field>
                <DialogFooter>
                    <Button className="w-full" onClick={action}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default StageForm;