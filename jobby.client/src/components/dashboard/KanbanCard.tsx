import { EditAppSheet } from "@/components/app/EditApp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DeleteApp, GenerateApp } from "@/services/appService";
import type { KanbanCardProps } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import { CalendarDays, ExternalLink, File, MapPin, MoreVertical, Trash2 } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { toast } from "sonner";

export function KanbanCard({ item, onUpdate, isMatch }: KanbanCardProps) {
    const { ref: dragRef } = useDraggable({
        id: item.id!
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        setResumeFile(file ?? null);
    }

    async function handleResumeGeneration() {
        if (!item.id) {
            toast.warning("This application must be saved before generating a resume.");
            return;
        }

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
        if (!item.id) {
            toast.warning("This application must be saved before it can be deleted.");
            return;
        }

        await DeleteApp(item.id);
        onUpdate();
        toast.info("The application has been deleted.")
    }

    return (
        <div ref={dragRef} className={isMatch ? "w-full" : "hidden"}>
            <Card
                className="w-full cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
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
                                    {item.title}
                                </h3>
                                <p className="truncate text-sm text-muted-foreground">
                                    {item.companyName}
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0" onClick={(event) => event.stopPropagation()}>
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
            <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
                <SheetContent className="overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Application Details</SheetTitle>
                        <SheetDescription>
                            Review this job application here.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="px-4">
                        <div className="flex items-center gap-3 py-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                                {item.companyName.slice(0, 1)}
                            </div>
                            <div className="min-w-0">
                                <h3 className="truncate font-semibold">{item.companyName}</h3>
                                <p className="truncate text-sm text-muted-foreground">{item.title}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 py-3">
                            {item.locationType && (
                                <Badge variant={getBadgeVariant(item.locationType)}>
                                    {item.locationType}
                                </Badge>
                            )}
                            {item.salary && (
                                <Badge variant="outline">{formatCurrency(item.salary)}</Badge>
                            )}
                        </div>

                        <InfoField label="Company Name" value={item.companyName} />
                        <InfoField label="Title" value={item.title} />
                        <InfoField label="Location Type" value={item.locationType} />
                        <InfoField label="Address" value={item.address} />
                        <InfoField label="Target Salary" value={item.salary ? formatCurrency(item.salary) : undefined} />
                        <InfoField label="Apply Date" value={formatDate(item.appliedDate)} />
                        <InfoField
                            label="Upcoming"
                            value={item.upcomingDate ? `${item.upcomingType ?? "Event"}: ${formatDate(item.upcomingDate)}` : undefined}
                        />

                        {item.notes && (
                            <Field className="py-3">
                                <FieldLabel>Notes</FieldLabel>
                                <FieldDescription className="whitespace-pre-wrap">
                                    {item.notes}
                                </FieldDescription>
                            </Field>
                        )}
                    </div>

                    {item.postingUrl && (
                        <SheetFooter>
                            <Button asChild variant="outline" className="w-full justify-between">
                                <a href={item.postingUrl} target="_blank" rel="noreferrer">
                                    <span>Open Job Posting</span>
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </Button>
                        </SheetFooter>
                    )}
                </SheetContent>
            </Sheet>
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

function formatDate(date?: Date) {
    if (!date) return undefined;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(date));
}

function InfoField({ label, value }: { label: string; value?: string }) {
    return (
        <Field className="py-3">
            <FieldLabel>{label}</FieldLabel>
            <FieldDescription>{value || "Not provided"}</FieldDescription>
        </Field>
    );
}

