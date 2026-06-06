import { KanbanColumn } from "@/components/dashboard/KanbanColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateApp } from "@/services/appService";
import { CreateStage, GetAllStages } from "@/services/stageService";
import type { Application, Stage } from "@/types/";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function KanbanBoard() {
    const [stages, setStages] = useState<Stage[]>([]);
    const [refresh, setRefresh] = useState(0);
    const stagesRef = useRef(stages);
    const [name, setName] = useState("");
    const [order, setOrder] = useState("");
    const [color, setColor] = useState("");

    async function handleCreate() {
        await CreateStage({ name, order: parseInt(order), color });
        handleRefresh();
        toast.info("The pipeline stage was successfully created.");
    }
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
        catch(ex) {
            toast.error("An error occured while moving your application.")
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
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline"><Plus /></Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader>
                            <PopoverTitle>New Pipeline Stage</PopoverTitle>
                            <PopoverDescription>Create a new stage for your pipeline.</PopoverDescription>
                        </PopoverHeader>
                        <Label>Name</Label>
                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        <Label>Order</Label>
                        <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
                        <Label>Color</Label>
                        <Select value={color} onValueChange={setColor}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="purple">Purple</SelectItem>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="amber">Amber</SelectItem>
                                    <SelectItem value="teal">Teal</SelectItem>
                                    <SelectItem value="yellow">Yellow</SelectItem>
                                    <SelectItem value="green">Green</SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleCreate}>
                            Create
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="flex flex-row gap-4 pb-4 items-stretch overflow-x-auto">
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