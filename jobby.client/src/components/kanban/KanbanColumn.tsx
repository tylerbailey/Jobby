import CreateApp from "@/components/app/CreateApp";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { deleteStage } from "@/services/stageService";
import { useDroppable } from '@dnd-kit/react';
import { MoreVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Colors } from "@/enums/enums";

export type KanbanColumnProps = {

    stage: Stage;
    searchValue: string;
    onUpdate: () => void;
};

export function KanbanColumn({ stage, onUpdate, searchValue }: KanbanColumnProps) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [sheetOpen, setSheetOpen] = useState<boolean>(false);
    const { ref } = useDroppable({
        id: stage.id.toString()
    });
    async function handleDelete() {
        try {
            if (stage.items.length == 0) {
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
        <section className="w-full shrink-0 sm:w-fit sm:min-w-80" ref={ref}>
            <Card className="min-h-[600px] h-full w-full border bg-muted/30 p-3 sm:w-fit sm:min-w-80">
                <div className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 ${getStageColors(stage.color)}`}>
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{stage.name}</h2>
                        <span className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium">
                            {(stage.items ?? []).length}
                        </span>
                    </div>
                    <span className="flex items-center gap-2 text-xs font-medium">
                        Step {stage.order}
                        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-1">
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
                    </span>
                </div>

                {stage.items && stage.items.map((item) => (

                    <KanbanCard key={item.id} item={item} onUpdate={onUpdate} isMatch={searchObject(item, searchValue)} />

                ))}

            </Card>
            <CreateApp sheetOpen={sheetOpen} setSheetOpen={setSheetOpen} stage={stage.id} onUpdate={onUpdate}></CreateApp>
        </section>
    );

    function searchObject<T extends object>(item: T, term: string): boolean {
        return Object.values(item).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase())
        );
    }

    function getStageColors(color: string) {
        return Colors[color];
    }
}

