import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Recruiter } from "@/types";
import RecruiterCard from "./RecruiterCard";
import CreateRecruiter from "./CreateRecruiter";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export type RecruiterCardProps = {
    recruiters: Recruiter[];
    onUpdate: () => void;
}

export default function RecruiterColumn({ recruiters, onUpdate }: RecruiterCardProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <div>
            <Card className="w-80 min-h-[calc(100vh-220px)] shrink-0">
                <CardHeader>
                    <div className="flex justify-between items-center gap-4">
                        <h1 className="text-2xl font-bold">Recruiters</h1>
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {recruiters.map((recruiter) => (
                        <RecruiterCard onUpdate={onUpdate} recruiter={recruiter} />

                    ))}
                </CardContent>
            </Card>
            <CreateRecruiter onUpdate={onUpdate} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </div>
    );
}
