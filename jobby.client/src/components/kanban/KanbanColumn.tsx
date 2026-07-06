import CreateApp from "@/components/app/CreateApp";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ElementColors, HoverColors } from "@/consts/consts";
import { COLUMN_DRAG_PREFIX, COLUMN_DROP_PREFIX, mergeRefs } from "@/helpers/kanbanHelpers";
import { deleteStage } from "@/services/stageService";
import type { Stage } from "@/types";
import EditStage from "@/components/stage/EditStage";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import { GripVertical, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export type KanbanColumnProps = {
    stage: Stage;
    searchValue: string;
    onUpdate: () => void;
};

export function KanbanColumn({ stage, onUpdate, searchValue }: KanbanColumnProps) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    const stageId = stage.id!.toString();
    const { ref: cardDropRef } = useDroppable({ id: stageId });
    const { ref: columnDropRef } = useDroppable({ id: `${COLUMN_DROP_PREFIX}${stageId}` });
    const { ref: columnDragRef, handleRef: columnHandleRef, isDragging } = useDraggable({
        id: `${COLUMN_DRAG_PREFIX}${stageId}`,
    });

    async function handleDelete() {
        try {
            if ((stage.items ?? []).length === 0) {
                await deleteStage(stage.id);
                setMenuOpen(false);
                onUpdate();
                toast.info("The pipeline stage has been deleted.")
            }
            else {
                toast.warning("You must remove all applications from the stage before deleting.")
            }
        }
        catch {
            toast.error("An error occurred while deleting the stage")
        }
    }

    function handleNew() {
        setSheetOpen(true);
        setMenuOpen(false);
    }

    return (
        <section className="w-full shrink-0 sm:w-fit sm:min-w-80">
            <Card
                ref={mergeRefs(columnDragRef, columnDropRef)}
                className={`min-h-[600px] w-full border bg-muted/30 p-3 transition-shadow sm:w-fit sm:min-w-80 ${isDragging ? "opacity-60 shadow-lg ring-2 ring-primary/20" : ""}`}
            >
                <div
                    className={`mb-3 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 ${ElementColors[stage.color]} ${HoverColors[stage.color]}`}
                >
                    <div
                        ref={columnHandleRef}
                        className="flex min-w-0 flex-1 cursor-grab items-center gap-2 active:cursor-grabbing"
                    >
                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <h2 className="truncate font-semibold">{stage.name}</h2>
                        <span className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium">
                            {(stage.items ?? []).length}
                        </span>
                    </div>
                    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-1">
                            <Button
                                onClick={() => setDialogOpen(true)}
                                variant="ghost"
                                className="flex h-9 w-full items-center justify-between px-2">
                                <span>Edit</span>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={handleNew}
                                variant="ghost"
                                className="flex h-9 w-full items-center justify-between px-2">
                                <span>New Application</span>
                                <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={handleDelete}
                                variant="ghost"
                                className="flex h-9 w-full items-center justify-between px-2">
                                <span>Delete</span>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </PopoverContent>
                    </Popover>
                </div>
                <div ref={cardDropRef} className="space-y-2">
                    {stage.items && stage.items.map((item) => (
                        <KanbanCard key={item.id} item={item} onUpdate={onUpdate} isMatch={searchObject(item, searchValue)} />
                    ))}
                </div>
            </Card>
            <CreateApp sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} stage={stage.id} onUpdate={onUpdate} />
            <EditStage stage={stage} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} onUpdate={onUpdate} />
        </section>
    );

    function searchObject<T extends object>(item: T, term: string): boolean {
        return Object.values(item).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase())
        );
    }
}
