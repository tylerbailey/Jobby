import { EditAppSheet } from "@/components/app/EditApp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteApp, GenerateApp } from "@/services/appService";
import type { KanbanCardProps } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import { CalendarDays, File, MapPin, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function KanbanCard({ item, onUpdate }: KanbanCardProps) {
    const { ref: dragRef } = useDraggable({
        id: item.id!
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        setResumeFile(file);
    }

    async function handleResumeGeneration() {
        if (resumeFile != null) {
            setOpen(false);
            const promise = GenerateApp(resumeFile, item.id)

            toast.promise(promise, {
                loading: "Generating resume. Your file will automatically be downloaded when complete.",
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
        await DeleteApp(item.id);
        onUpdate();
        toast.info("The application has been deleted.")
    }

    return (
        <div ref={dragRef} className="w-full">
            <Card className="w-full cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="px-2">
                    <div className="flex min-w-0 items-start justify-between gap-2">
                        <div className="flex min-w-0 flex-1 items-start gap-1">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                                {item.companyName.slice(0, 1)}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="truncate font-semibold leading-tight">
                                    {item.title}
                                </h3>
                                <p className="truncate text-sm text-muted-foreground">
                                    {item.companyName}
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-1">
                                    <Button
                                        onClick={handleDelete}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Delete</span>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <EditAppSheet item={item} onUpdate={onUpdate}></EditAppSheet>
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild><Button variant="ghost" className="flex h-9 w-full items-center justify-between px-2">
                                            <span>Generate Resume</span>
                                            <File className="h-4 w-4" />
                                        </Button></DialogTrigger>
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
                            <div className="flex items-center gap-2 border-t pt-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>{item.appliedDate.toString()}</span>
                            </div>
                        )}

                        {item.upcomingDate && (
                            <div className="flex items-center gap-2 border-t pt-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>{item.upcomingType}: {item.upcomingDate.toString()}</span>
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
        </div >
    );
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
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

