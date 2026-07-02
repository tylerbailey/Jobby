import InfoCards from "@/components/kanban/InfoCards";
import { KanbanBoard } from "@/components/kanban/Kanban";
import RecruiterColumn from "@/components/recruiters/RecruiterColumn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Status } from "@/consts/consts";
import { getAllRecruiters } from "@/services/recruiterService";
import { getAllStages } from "@/services/stageService";
import type { Recruiter, Stage } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CreateStage from "@/components/stage/CreateStage";

export default function Dashboard() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [stages, setStages] = useState<Stage[]>([]);
    const [refresh, setRefresh] = useState(0);
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

    return (
        <div className="space-y-6">
            <div className="flex flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Job Application Pipeline
                        </h1>
                        <Button size="icon" onClick={() => setDialogOpen(true)}>
                            <Plus />
                        </Button>
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
                <RecruiterColumn recruiters={recruiters} onUpdate={handleRefresh} />
                <KanbanBoard stages={stages} setStages={setStages} onUpdate={handleRefresh} searchValue={searchValue} />
            </div>
            <CreateStage dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} onUpdate={handleRefresh } />
        </div>
    );
}
