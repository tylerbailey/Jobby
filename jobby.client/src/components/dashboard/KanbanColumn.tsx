import CreateApp from "@/components/app/CreateApp";
import { KanbanCard } from "@/components/dashboard/KanbanCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteStage } from "@/services/stageService";
import type { KanbanColumnProps } from "@/types";
import { useDroppable } from '@dnd-kit/react';
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
export function KanbanColumn({ id, title, order, color, stage, items, onUpdate, searchValue }: KanbanColumnProps) {
    const { ref } = useDroppable({
        id: stage.toString()
    });
    const cardStacks = chunkItems(items, 5);

    function handleDelete() {
        DeleteStage(id);
        onUpdate();
        toast.info("The pipeline stage has been deleted.")
    }
    return (
        <section className="w-full shrink-0 sm:w-fit sm:min-w-80" ref={ref}>
            <Card className="min-h-[600px] h-full w-full border bg-muted/30 p-3 sm:w-fit sm:min-w-80">
                <div className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 ${getStageColors(color)}`}>
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{title}</h2>
                        <span className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium">
                            {items.length}
                        </span>

                    </div>
                    <span className="flex items-center gap-2 text-xs font-medium">
                        Step {order}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-1">
                                <Button
                                    onClick={handleDelete}
                                    variant="ghost"
                                    className="flex h-9 w-full items-center justify-between px-2">
                                    <span>Delete</span>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <CreateApp stage={stage} onUpdate={onUpdate}></CreateApp>
                            </PopoverContent>

                        </Popover>
                    </span>
                </div>

                <div className="flex gap-3 pb-1">
                    {cardStacks.map((stack, index) => (
                        <div key={`${stage}-stack-${index}`} className="flex w-full shrink-0 flex-col gap-3 sm:w-72">
                            {stack.map((item) => (
                                <KanbanCard key={item.id} item={item} onUpdate={onUpdate} isMatch={searchObject(item, searchValue)} />
                            ))}
                        </div>
                    ))}
                </div>
               

            </Card>
        </section>
    );

    function searchObject<T extends object>(item: T, term: string): boolean {
        return Object.values(item).some(val =>
            typeof val === 'string' && val.toLowerCase().includes(term.toLowerCase())
        );
    }

    function getStageColors(color: string) {
        switch (color) {
            case "purple": return "bg-purple-50 border-purple-200 text-purple-700";
            case "blue": return "bg-blue-50 border-blue-200 text-blue-700";
            case "amber": return "bg-amber-50 border-amber-200 text-amber-700";
            case "teal": return "bg-teal-50 border-teal-200 text-teal-700";
            case "yellow": return "bg-yellow-50 border-yellow-200 text-yellow-700";
            case "green": return "bg-green-50 border-green-200 text-green-700";
            case "red": return "bg-red-50 border-red-200 text-red-700";
            default: return "bg-gray-50 border-gray-200 text-gray-700";
        }
    }
}

function chunkItems<T>(items: T[], chunkSize: number) {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += chunkSize) {
        chunks.push(items.slice(index, index + chunkSize));
    }

    return chunks;
}
