import { useEffect, useRef, useState } from "react";
import { KanbanColumn } from "@/components/dashboard/KanbanColumn";
import {  UpdateApp } from "@/services/appService";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import type { Application, Stage } from "@/types/";
import { AddStage } from "./AddStage";
import { GetAllStages } from "@/services/stageService";

export function KanbanBoard() {
    const [stages, setStages] = useState<Stage[]>([]);
    const [refresh, setRefresh] = useState(0);
    const stagesRef = useRef(stages);

    useEffect(() => {
        stagesRef.current = stages;
    }, [stages]);

    useEffect(() => {
        async function GetMyStages() {
            const response = await GetAllStages();
            setStages(response.data)
        }
        GetMyStages();
    }, [refresh]);

    function findCard(stages: Stage[], cardId: string): Application | undefined {
        for (const stage of stages) {
            const card = stage.items.find(item => item.id?.toString() === cardId);
            if (card) return card;
        }
        return undefined;
    }

    function handleDragEnd(event: DragEndEvent) {
        if (event.canceled) return;
        const { source, target } = event.operation;
        if (!source || !target) return;

        const cardId = source.id.toString();
        const newStageId = Number(target.id);

        setStages(prev => {
            const card = findCard(prev, cardId);
            if (!card) return prev;

            return prev.map(stage => {
                if (stage.id === card.stageId) {
                    return {
                        ...stage,
                        items: stage.items.filter(item => item.id?.toString() !== cardId)
                    };
                }
                if (stage.id === newStageId) {
                    return {
                        ...stage,
                        items: [...stage.items, { ...card, stageId: newStageId }]
                    };
                }
                return stage;
            });
        });

        const card = findCard(stagesRef.current, cardId);
        if (card) {
            UpdateApp({ ...card, stageId: newStageId })
                .catch(() => handleRefresh());
        }
    }

    function handleRefresh() {
        setRefresh(prev => prev + 1);
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Job Application Pipeline
                </h1>
                <AddStage onUpdate={handleRefresh}></AddStage>
            </div>
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pb-4">
                    {stages.map((stage) => (
                        <KanbanColumn
                            key={stage.id}
                            id={ stage.id}
                            title={stage.name}
                            color={stage.color}
                            order={stage.order}
                            items={stage.items}
                            stage={stage.id}
                            onUpdate={handleRefresh}
                        />
                    ))}
                </div>
            </DragDropProvider>
        </div>
    );
}