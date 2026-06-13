import { EditAppSheet } from "@/components/app/EditApp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteApp, GenerateApp, UpdateApp } from "@/services/appService";
import type { Application, HistoryItem, KanbanCardProps } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import { CalendarDays, Check, Clock3, File, MapPin, MoreVertical, Pencil, Timeline, Trash2, X } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { GetHistory } from "@/services/historyService";
import AppInfo from "@/components/app/AppInfo";
import JobHistory from "@/components/timeline/JobHistory";
import { formatCurrency, formatDate } from "../../helpers/formatHelpers";

export function KanbanCard({ item, onUpdate, isMatch }: KanbanCardProps) {
    const { ref: dragRef } = useDraggable({
        id: item.id!
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [histories, setHistories] = useState<HistoryItem[]>([])

    const [dialogueOpen, setDialogueOpen] = useState<boolean>(false);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [historyOpen, setHistoryOpen] = useState<boolean>(false);


    const firstCutOff = new Date();
    const secondCutOff = new Date();
    firstCutOff.setDate(firstCutOff.getDate() + 7);
    secondCutOff.setDate(secondCutOff.getDate() + 2);

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        setResumeFile(file ?? null);
    }

    async function handleResumeDialogue() {
        setMenuOpen(false);
        setDialogueOpen(true)
    }

    function handleHistory() {
        setMenuOpen(false); 
        setHistoryOpen(true);
    }

    async function handleResumeGeneration() {
        if (!item.id) {
            toast.warning("This application must be saved before generating a resume.");
            return;
        }

        if (resumeFile != null) {
            setDialogueOpen(false);
            const promise = GenerateApp(resumeFile, item.id)

            toast.promise(promise, {
                loading: "Generating resume. Your file will automatically download when complete.",
                success: () => "Your resume has been created",
                error: "Error",
            })

            const blob = await promise

            const url = window.URL.createObjectURL(new Blob([blob]))
            const a = document.createElement("a");
            a.href = url;
            a.download = "TailoredResume.docx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
        else {
            toast.warning("You must select a docx file.")
        }
    }

    async function handleDelete() {
        if (!item.id) {
            toast.warning("This application must be saved before it can be deleted.");
            return;
        }

        await DeleteApp(item.id.toString());
        onUpdate();
        toast.info("The application has been deleted.")
    }

    function handleEdit() {
        setMenuOpen(false);
        setEditOpen(true);
    }

    async function handleRejected() {
        await UpdateApp({
           ... item,
            isRejected: true,
            isAccepted: false            
        });

        onUpdate();
    }

    async function handleInProgress() {
        await UpdateApp({
            ...item,
            isRejected: false,
            isAccepted: false
        });

        onUpdate();
    }

    async function handleAccepted() {
        await UpdateApp({
            ...item,
            isRejected: false,
            isAccepted: true
        });
        onUpdate();
    }

    useEffect(() => {
        async function GetItemHistory() {
            const response = await GetHistory(item.id!)
            setHistories(response.data)
        }
        GetItemHistory();
    }, [item.id]);

    return (
        <div ref={dragRef} className={isMatch ? "w-full" : "hidden"}>
            <Card
                className={`w-full cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md  ${getCardColor(item)}`}
                onClick={() => setInfoOpen(true)}
            >
                <CardHeader className="px-2">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-start gap-1">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                                {item.companyName.slice(0, 1)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate font-semibold leading-tight">
                                    {item.jobTitle}
                                </h3>
                                <p className="truncate text-sm text-muted-foreground">
                                    {item.companyName}
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0" onClick={(event) => event.stopPropagation()}>
                            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-1">
                                    <Button
                                        onClick={handleEdit}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Edit Application</span>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={ handleHistory }
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>History</span>
                                        <Timeline className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={handleResumeDialogue}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Generate Resume</span>
                                        <File className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={handleInProgress}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>In Progress</span>
                                        <Clock3 className="h-4 w-4" />
                                    </Button>
                                    <Button          
                                        onClick={handleAccepted}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Accepted</span>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button      
                                        onClick={handleRejected}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Rejected</span>
                                        <X className="h-4 w-4" />
                                    </Button>                                    
                                    <Button
                                        onClick={handleDelete}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Delete</span>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                </CardHeader>
                <CardContent className="p-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                        <Badge key={"locationTypeId-" + item.locationTypeId} variant={getBadgeVariant(item.locationType ?? "")}>
                            {item.locationType}
                        </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        {item.address && (
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{item.address}</span>
                            </div>
                        )}

                        {item.salary && (
                            <div className="font-medium text-foreground">{formatCurrency(item.salary)}</div>
                        )}

                        {item.appliedDate && (
                            <div className="flex items-center gap-2te border-t pt-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>{formatDate(item.appliedDate)}</span>
                            </div>
                        )}                      
                    </div>

                    {item.notes && (

                        <div className="mt-3 flex items-center gap-2">
                            <Badge variant={"outline"}>
                                <HoverCard>
                                    <HoverCardTrigger>Notes</HoverCardTrigger>
                                    <HoverCardContent>
                                        {item.notes}
                                    </HoverCardContent>
                                </HoverCard>
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>
            <EditAppSheet sheetOpen={editOpen} setSheetOpen={setEditOpen} item={item} onUpdate={onUpdate} />
            <AppInfo item={item} infoOpen={infoOpen} setInfoOpen={setInfoOpen} />
            <JobHistory sheetOpen={historyOpen} setSheetOpen={setHistoryOpen} items={histories} />
            <Dialog open={dialogueOpen} onOpenChange={setDialogueOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Generate Resume</DialogTitle>
                        <DialogDescription>
                            Generate a tailored resume for this job.
                        </DialogDescription>
                    </DialogHeader>
                    <Input type="file" accept=".docx" onChange={(e) => handleFileChange(e)}></Input>
                    <Button onClick={handleResumeGeneration}>Generate</Button>
                </DialogContent>
            </Dialog>
        </div >
    );
}

function getCardColor(item: Application) {
    if (item.isRejected)
        return "bg-red-50"
    else if (item.isAccepted)
        return "bg-green-50"
}

function getBadgeVariant(type: string): "default" | "secondary" | "outline" {
    switch (type?.toLowerCase()) {
        case "remote":
            return "secondary";
        case "hybrid":
            return "outline";
        case "on-site":
            return "default";
        default:
            return "secondary";
    }
}






