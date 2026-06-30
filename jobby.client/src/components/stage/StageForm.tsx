import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Stage } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Colors, ElementColors, FocusColors, HoverColors } from "../../consts/consts";

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
    const [color, setColor] = useState(stage.color);

    function handleColorChange(color: string) {
        setColor(color)
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
                    <FieldLabel htmlFor="input-stage-order">Order</FieldLabel>
                    <FieldDescription>
                        The position of the stage in the pipeline.
                    </FieldDescription>
                    <Input
                        id="input-stage-order"
                        type="number"
                        placeholder="Enter the display order"
                        value={stage.order}
                        onChange={(e) => setStage({ ...stage, order: Number.parseInt(e.target.value) })} />
                </Field>
                <Field className="py-3">
                    <FieldLabel>Color</FieldLabel>
                    <FieldDescription>
                        The color used to display the stage.
                    </FieldDescription>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <span className=""> <Button variant="outline" className={`w-full ${FocusColors[color as keyof typeof FocusColors]} ${HoverColors[color as keyof typeof HoverColors]} ${ElementColors[color as keyof typeof ElementColors]}`}>{color}</Button></span>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="center" side="top">
                            <div className="grid grid-cols-3 gap-4">
                                {Object.entries(Colors).map(([label]) => (
                                    <Button onClick={() => handleColorChange(label)} variant="outline" className={`max-w-25 ${HoverColors[label as keyof typeof HoverColors]} ${ElementColors[label as keyof typeof  ElementColors]}`}>
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