import PipelineStats from "@/components/dashboard/PipelineStats";
import { KanbanBoard } from "@/components/kanban/Kanban";
import RecruiterColumn from "@/components/recruiters/RecruiterColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllRecruiters } from "@/services/recruiterService";
import { getAllStages } from "@/services/stageService";
import type { Recruiter, Stage } from "@/types";
import { LayoutDashboard, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CreateStage from "@/components/stage/CreateStage";

/** Renders the main dashboard with the recruiter list and kanban pipeline board. */
export default function Dashboard() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [stages, setStages] = useState<Stage[]>([]);
    const [refresh, setRefresh] = useState(0);
    const [searchValue, setSearchValue] = useState("");
    const [recruiters, setRecruiters] = useState<Recruiter[]>([])
    const [recruitersLoaded, setRecruitersLoaded] = useState(false);
    const [stagesLoaded, setStagesLoaded] = useState(false);

    useEffect(() => {
        /** Loads the user's recruiters. */
        async function getMyRecruiters() {
            try {
                const response = await getAllRecruiters();
                setRecruiters(response.data)
            } finally {
                setRecruitersLoaded(true);
            }
        }
        getMyRecruiters();
    }, [refresh])

    useEffect(() => {
        /** Loads the pipeline stages. */
        async function getMyStages() {
            try {
                const response = await getAllStages();
                setStages(response.data);
            } finally {
                setStagesLoaded(true);
            }
        }
        getMyStages();
    }, [refresh]);

    /** Triggers a reload of recruiters and pipeline stages. */
    function handleRefresh() {
        setRefresh(prev => prev + 1);
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Job Application Pipeline
                        </h1>
                        <Button size="icon" onClick={() => setDialogOpen(true)}>
                            <Plus />
                        </Button>
                    </div>
                    <div className="w-full lg:w-80">
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)} />
                    </div>
                </div>
                <PipelineStats stages={stages} isLoaded={stagesLoaded} />
            </div>
            <div className="flex flex-row items-stretch gap-8">
                <RecruiterColumn recruiters={recruiters} isLoaded={recruitersLoaded} onUpdate={handleRefresh} />
                {stagesLoaded && stages.length === 0 ? (
                    <div className="flex min-h-[calc(100vh-22rem)] flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6">
                        <div className="flex max-w-sm flex-col items-center gap-3 text-center">
                            <LayoutDashboard className="size-8 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="font-semibold">No pipeline stages</p>
                                <p className="text-sm text-muted-foreground">
                                    Create a stage to start organizing your applications.
                                </p>
                            </div>
                            <Button onClick={() => setDialogOpen(true)}>
                                <Plus />
                                Create stage
                            </Button>
                        </div>
                    </div>
                ) : (
                    <KanbanBoard stages={stages} setStages={setStages} onUpdate={handleRefresh} searchValue={searchValue} />
                )}
            </div>
            <CreateStage dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} onUpdate={handleRefresh } />
        </div>
    );
}
