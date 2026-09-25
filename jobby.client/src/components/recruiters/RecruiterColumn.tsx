import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Recruiter } from "@/types";
import RecruiterCard from "./RecruiterCard";
import CreateRecruiter from "./CreateRecruiter";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

export type RecruiterCardProps = {
    recruiters: Recruiter[];
    isLoaded: boolean;
    onUpdate: () => void;
}

/** Renders the column listing all recruiter contact cards. */
export default function RecruiterColumn({ recruiters, isLoaded, onUpdate }: RecruiterCardProps) {
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
                    {isLoaded && recruiters.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-2 py-10 text-center">
                            <Users className="size-8 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="font-semibold">No recruiters</p>
                                <p className="text-sm text-muted-foreground">
                                    Add a recruiter to keep their contact details here.
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => setDialogOpen(true)}>
                                <Plus />
                                Add recruiter
                            </Button>
                        </div>
                    ) : (
                        recruiters.map((recruiter) => (
                            <RecruiterCard key={`recruiter${recruiter.id}`} onUpdate={onUpdate} recruiter={recruiter} />
                        ))
                    )}
                </CardContent>
            </Card>
            <CreateRecruiter onUpdate={onUpdate} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </div>
    );
}
