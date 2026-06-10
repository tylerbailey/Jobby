import { KanbanColumn } from "@/components/dashboard/KanbanColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoveStage } from "@/services/appService";
import { CreateStage, GetAllStages } from "@/services/stageService";
import type { Application, Stage } from "@/types/";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import InfoCards from "./InfoCards";

export function KanbanBoard() {
    const [stages, setStages] = useState<Stage[]>([]);
    const [refresh, setRefresh] = useState(0);
    const stagesRef = useRef(stages);
    const [name, setName] = useState("");
    const [order, setOrder] = useState("");
    const [color, setColor] = useState("");
    const [searchValue, setSearchValue] = useState("")
    const [totalApps, setTotalApps] = useState(0)
    const [appliedApps, setAppliedApps] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null);

    function scrollLeft() {
        scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    }

    function scrollRight() {
        scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    }

    useEffect(() => {
        stagesRef.current = stages;
    }, [stages]);

    useEffect(() => {
        async function GetMyStages() {
            const response = await GetAllStages();
            const data = response.data;
            setStages(data);
            setTotalApps(data.reduce((total, stage) => total + (stage.items ?? []).length, 0));
            setAppliedApps(data.reduce((total, stage) => total + (stage.items ?? []).filter(item => item.appliedDate != null).length, 0));
        }
        GetMyStages();
    }, [refresh]);

    useEffect(() => {
        const timer = setTimeout(() => {
        }, 500);
        return () => clearTimeout(timer);
    }, [searchValue]);

    async function handleCreate() {
        await CreateStage({ name, order: parseInt(order), color });
        handleRefresh();
        toast.info("The stage was successfully created.");
    }

    function findCard(stages: Stage[], cardId: string): Application | undefined {
        for (const stage of stages) {
            const card = stage.items.find(item => item.id?.toString() === cardId);
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
                try {
                    await MoveStage(card.id, newStageId);
                } catch {
                    toast.error("An error occurred while moving your application.");
                    handleRefresh(); // revert optimistic update on failure
                }
            }
        }
        catch (ex) {
            toast.error("An error occured while moving your application.")
        }
    }

    function handleRefresh() {
        setRefresh(prev => prev + 1);
    }
    return (

        <div className="space-y-6">

            <div className="flex items-start justify-between gap-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Job Application Pipeline
                        </h1>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Plus />
                                </Button>
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

                    <div className="w-96">
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>

                <InfoCards
                    active={totalApps}
                    applied={appliedApps}
                    rejected={0}
                />
            </div>
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="relative flex items-center">
                    <Button
                        size="icon"
                        onMouseDown={scrollLeft}
                        className="fixed left-70 top-1/2 opacity-50 hover:opacity-100 z-50 shadow-md"
                    >
                        <ChevronLeft />
                    </Button>
                    <div
                        ref={scrollRef}
                        className="flex flex-row gap-4 overflow-x-hidden px-4"
                    >
                        {stages.map((stage) => (
                            <KanbanColumn
                                key={stage.id}
                                id={stage.id}
                                title={stage.name}
                                color={stage.color}
                                order={stage.order}
                                items={stage.items}
                                stage={stage.id}
                                searchValue={searchValue}
                                onUpdate={handleRefresh}
                            />
                        ))}
                    </div>

                    <Button
                        size="icon"
                        onMouseDown={scrollRight}
                        className="fixed right-4 opacity-50 hover:opacity-100 top-1/2 z-50 shadow-md"
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </DragDropProvider>
        </div>
    );
}
