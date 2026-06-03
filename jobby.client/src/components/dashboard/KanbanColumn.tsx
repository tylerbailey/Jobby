import { Card } from "@/components/ui/card";
import { KanbanCard } from "./KanbanCard";
import { useDroppable } from '@dnd-kit/react';
import CreateApp from "@/components/app/CreateApp";
import type {KanbanColumnProps } from "@/types"
export function KanbanColumn({ title, color, stage, items, onUpdate }: KanbanColumnProps) {
    const { ref } = useDroppable({
        id:stage.toString()
    });
    return (
        <section className="w-80 shrink-0" ref={ref}>
            <Card className="min-h-[600px] border bg-muted/30 p-3">
                <div className={`mb-3 flex items-center justify-between rounded-lg border px-3 py-2 ${getStageColors(color)}`}>
                    <div className="flex items-center gap-2">
                        <h2 className="font-semibold">{title}</h2>
                        <span className="rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium">
                            {items.length}
                        </span>
                    </div>                   
                </div>

                <div className="space-y-3">
                    {items.map((item) => (
                        <KanbanCard key={item.id} item={item} onUpdate={onUpdate} />
                    ))}
                </div>
                <CreateApp stage={stage} onUpdate={onUpdate}></CreateApp>
                
            </Card>
        </section>
    );

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