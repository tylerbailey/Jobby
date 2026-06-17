import InfoCards from "@/components/dashboard/InfoCards";
import { KanbanColumn } from "@/components/dashboard/KanbanColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { moveAppStage } from "@/services/appService";
import { createStage, getAllStages } from "@/services/stageService";
import type { Application, Stage } from "@/types/";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Colors, Status } from "../../enum/enums";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

export function KanbanBoard() {
    const [stages, setStages] = useState<Stage[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState(0);
    const [name, setName] = useState("");
    const [order, setOrder] = useState("");
    const [color, setColor] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [totalApps, setTotalApps] = useState(0);
    const [totalRejected, setTotalRejected] = useState(0)
    const [appliedApps, setAppliedApps] = useState(0)
    const scrollRef = useRef<HTMLDivElement>(null);
    const stagesRef = useRef(stages);

    useEffect(() => {
        stagesRef.current = stages;
    }, [stages]);

    useEffect(() => {
        async function GetMyStages() {
            const response = await getAllStages();
            const data = response.data;
            setStages(data);
            setTotalApps(data.reduce((total, stage) => total + (stage.items ?? []).length, 0));
            setAppliedApps(data.reduce((total, stage) => total + (stage.items ?? []).filter(item => item.appliedDate != null).length, 0));
            setTotalRejected(data.reduce((total, stage) => total + (stage.items ?? []).filter(item => item.status == Status.Rejected).length, 0));
        }
        GetMyStages();
    }, [refresh]);

    useEffect(() => {
        const timer = setTimeout(() => {
        }, 500);
        return () => clearTimeout(timer);
    }, [searchValue]);

    async function handleCreate() {
        await createStage({ name, order: parseInt(order), color });
        setDialogOpen(false);
        handleRefresh();
        toast.info("The stage was successfully created.");
    }

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
                    handleRefresh(); // revert optimistic update on failure
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

    function handleRefresh() {
        setRefresh(prev => prev + 1);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Job Application Pipeline
                        </h1>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="icon">
                                    <Plus />
                                </Button>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Pipeline Stage</DialogTitle>
                                    <DialogDescription>
                                        Create a new stage for your pipeline.
                                    </DialogDescription>
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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
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
                                        value={order}
                                        onChange={(e) => setOrder(e.target.value)}
                                    />
                                </Field>

                                <Field className="py-3">
                                    <FieldLabel>Color</FieldLabel>
                                    <FieldDescription>
                                        The color used to display the stage.
                                    </FieldDescription>
                                    <Select value={color} onValueChange={setColor}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a color" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Colors</SelectLabel>
                                                {Object.entries(Colors).map(([label]) => (
                                                    <SelectItem key={label} value={label}>
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <DialogFooter>
                                    <Button className="w-full" onClick={handleCreate}>
                                        Create
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="w-96">
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)} />
                    </div>
                </div>
                <InfoCards
                    active={totalApps - totalRejected}
                    applied={appliedApps}
                    rejected={totalRejected} />
            </div>
            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="relative flex items-center">
                    <Button
                        size="icon"
                        onMouseDown={handleScrollLeft}
                        className="fixed left-70 top-1/2 opacity-50 hover:opacity-100 z-50 shadow-md">
                        <ChevronLeft />
                    </Button>
                    <div
                        ref={scrollRef}
                        className="flex flex-row gap-4 overflow-x-hidden px-4">
                        {stages.map((stage) => (
                            <KanbanColumn
                                key={stage.id!}
                                stage={stage}
                                searchValue={searchValue}
                                onUpdate={handleRefresh} />
                        ))}
                    </div>
                    <Button
                        size="icon"
                        onMouseDown={handleScrollRight}
                        className="fixed right-4 opacity-50 hover:opacity-100 top-1/2 z-50 shadow-md">
                        <ChevronRight />
                    </Button>
                </div>
            </DragDropProvider>
        </div>
    );
}
