import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { Button } from "@/components/ui/button";
import { moveAppStage } from "@/services/appService";
import type { Application, Stage } from "@/types/";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export type KanbanBoardProps = {
    stages: Stage[];
    setStages: Dispatch<SetStateAction<Stage[]>>;
    onUpdate: () => void;
    searchValue: string;
}

export function KanbanBoard({stages, setStages, onUpdate, searchValue } : KanbanBoardProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const stagesRef = useRef(stages);

    useEffect(() => {
        stagesRef.current = stages;
    }, [stages]);

    function findCard(stages: Stage[], cardId: string): Application | undefined {
        for (const stage of stages) {
            const card = stage.items?.find(item => item.id?.toString() === cardId);
            if (card) return card;
        }
        return undefined;
    }

    async function handleDragEnd(event: DragEndEvent) {
        try {
            if (event.canceled) return;
            const { source, target } = event.operation;
            if (!source || !target) return;

            const cardId = source.id.toString();
            const newStageId = Number(target.id);

            setStages(prev => {
                const card = findCard(prev, cardId);
                if (!card) return prev;
                if (card.stageId === newStageId) return prev;
                return prev.map(stage => {
                    if (stage.id === card.stageId) {
                        return {
                            ...stage,
                            items: stage.items?.filter(item => item.id?.toString() !== cardId)
                        };
                    }
                    if (stage.id === newStageId) {
                        return {
                            ...stage,
                            items: [...stage.items!, { ...card, stageId: newStageId }]
                        };
                    }
                    return stage;
                });
            });
            const card = findCard(stagesRef.current, cardId);
            if (card) {
                try {
                    await moveAppStage(card.id!, newStageId);
                } catch {
                    toast.error("An error occurred while moving your application.");
                    onUpdate(); 
                }
            }
        }
        catch {
            toast.error("An error occured while moving your application.")
        }
    }

    function handleScrollLeft() {
        scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    }

    function handleScrollRight() {
        scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    }

    return (
            <DragDropProvider onDragEnd={handleDragEnd}>
              
                    <Button
                        size="icon"
                        onMouseDown={handleScrollLeft}
                        className="relative left-0 top-1/2 opacity-50 hover:opacity-100 z-50 shadow-md">
                        <ChevronLeft />
                    </Button>
                    <div
                        ref={scrollRef}
                        className="flex flex-row gap-4 overflow-x-hidden overflow-y-auto w-screen h-[calc(100vh-220px)]">
                        {stages.map((stage) => (
                            <KanbanColumn
                                key={stage.id!}
                                stage={stage}
                                searchValue={searchValue}
                                onUpdate={onUpdate} />
                        ))}
                    </div>
                    <Button
                        size="icon"
                        onMouseDown={handleScrollRight}
                        className="relative xl:right-20 opacity-50 hover:opacity-100 top-1/2 z-50 shadow-md">
                        <ChevronRight />
                    </Button>
              
            </DragDropProvider>
  
    );
}
