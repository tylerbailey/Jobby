import InfoCards from "@/components/kanban/InfoCards";
import { KanbanBoard } from "@/components/kanban/Kanban";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Colors, Status } from "@/enums/enums";
import { getAllRecruiters } from "@/services/recruiterService";
import { createStage, getAllStages } from "@/services/stageService";
import type { Recruiter, Stage } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RecruiterColumn from "@/components/recruiters/RecruiterColumn";

export default function Dashboard() {
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
    const [recruiters, setRecruiters] = useState<Recruiter[]>([])

    useEffect(() => {
        async function getMyRecruiters() {
            const response = await getAllRecruiters();
            setRecruiters(response.data)
        }
        getMyRecruiters();
    }, [refresh])

    useEffect(() => {
        async function getMyStages() {
            const response = await getAllStages();
            const data = response.data;
            setStages(data);
            setTotalApps(data.reduce((total, stage) => total + (stage.items ?? []).length, 0));
            setAppliedApps(data.reduce((total, stage) => total + (stage.items ?? []).filter(item => item.appliedDate != null).length, 0));
            setTotalRejected(data.reduce((total, stage) => total + (stage.items ?? []).filter(item => item.status == Status.Rejected).length, 0));
        }
        getMyStages();
    }, [refresh]);

    function handleRefresh() {
        setRefresh(prev => prev + 1);
    }

    async function handleCreate() {
        await createStage({ name, order: parseInt(order), color });
        setDialogOpen(false);
        handleRefresh();
        toast.info("The stage was successfully created.");
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-row items-center justify-between gap-8">
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
                                        onChange={(e) => setName(e.target.value)} />
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
                                        onChange={(e) => setOrder(e.target.value)} />
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
            <div className="flex flex-row items-stretch gap-8">
               
                <RecruiterColumn recruiters={recruiters} onUpdate={ handleRefresh} />
                <KanbanBoard stages={stages} setStages={setStages} onUpdate={handleRefresh} searchValue={searchValue} />
            </div>

        </div>
    );
}
