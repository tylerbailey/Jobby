import AppInfo from "@/components/app/AppInfo";
import { EditAppSheet } from "@/components/app/EditApp";
import JobHistory from "@/components/timeline/JobHistory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Status } from "@/consts/consts";
import { getBadgeVariant, getCardColor } from "@/helpers/componentHelpers";
import { formatCurrency, formatDate } from "@/helpers/formatHelpers";
import { deleteApp, updateApp } from "@/services/appService";
import { getHistory } from "@/services/historyService";
import type { Application, EventItem, HistoryItem } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import { Archive, CalendarDays, Check, Clock3, File, MapPin, MoreVertical, Pencil, Timeline, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type KanbanCardProps = {
    item: Application;
    isMatch: boolean;
    onUpdate: () => void;
}
export function KanbanCard({ item, onUpdate, isMatch }: KanbanCardProps) {
    const { ref: dragRef } = useDraggable({ id: item.id.toString() });
    const [histories, setHistories] = useState<HistoryItem[]>([]);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [historyOpen, setHistoryOpen] = useState<boolean>(false);

    function handleHistory() {
        setMenuOpen(false);
        setHistoryOpen(true);
    }

    async function handleDelete() {
        if (!item.id) {
            toast.warning("This application must be saved before it can be deleted.");
            return;
        }
        setMenuOpen(false);
        await deleteApp(item.id);
        onUpdate();
        toast.info("The application has been deleted.");
    }

    function handleEdit() {
        setMenuOpen(false);
        setEditOpen(true);
    }

    async function handleArchive() {
        setMenuOpen(false);
        await updateApp({
            ...item,
            isArchived: true
        });
        onUpdate();
        toast.info("The application has been archived.");
    }

    async function handleStatus(newStatus: number) {
        setMenuOpen(false);
        await updateApp({
            ...item,
            status: newStatus,
        });
        onUpdate();
    }

    useEffect(() => {
        async function loadItemHistory() {
            const response = await getHistory(item.id);
            setHistories(response.data);
        }

        loadItemHistory();
    }, [item.id]);

    return (
        <div ref={dragRef} className={isMatch ? "w-full" : "hidden"}>
            <Card className={`w-full cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md ${getCardColor(item)}`}
                onClick={() => setInfoOpen(true)}>
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
                                        <span>Edit</span>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        onClick={handleHistory}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>History</span>
                                        <Timeline className="h-4 w-4" />
                                    </Button>
                                    {item.status != Status.InProgress && (
                                        <Button
                                            onClick={() => handleStatus(Status.InProgress)}
                                            variant="ghost"
                                            className="flex h-9 w-full items-center justify-between px-2">
                                            <span>In Progress</span>
                                            <Clock3 className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {item.status != Status.Accepted && (
                                        <Button
                                            onClick={() => handleStatus(Status.Accepted)}
                                            variant="ghost"
                                            className="flex h-9 w-full items-center justify-between px-2">
                                            <span>Accepted</span>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}

                                    {item.status != Status.Rejected && (
                                        <Button
                                            onClick={() => handleStatus(Status.Rejected)}
                                            variant="ghost"
                                            className="flex h-9 w-full items-center justify-between px-2">
                                            <span>Rejected</span>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleArchive}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Archive</span>
                                        <Archive className="h-4 w-4" />
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
                            <div className="flex items-center gap-2 border-t pt-2">
                                <CalendarDays className="h-4 w-4" />
                                <span>{formatDate(item.appliedDate)}</span>
                            </div>
                        )}
                    </div>
                    {item.events.length > 0 &&
                        item.events.map((event) => (
                            <div
                                key={event.id}
                                className={`flex items-center gap-2 border-t pt-2 ${eventColor(event)}`}>
                                <CalendarDays className="h-4 w-4" />
                                <span>{formatDate(event.eventDate)}</span>
                            </div>
                        ))}
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
            <EditAppSheet sheetOpen={editOpen} setSheetOpen={setEditOpen} cardItem={item} onUpdate={onUpdate} />
            <AppInfo item={item} infoOpen={infoOpen} setInfoOpen={setInfoOpen} />
            <JobHistory sheetOpen={historyOpen} setSheetOpen={setHistoryOpen} items={histories} />
        </div>
    );
}

function eventColor(item: EventItem) {
    const now = new Date();
    const firstCutOff = new Date();
    const secondCutOff = new Date();
    firstCutOff.setDate(now.getDate() + 7);
    secondCutOff.setDate(now.getDate() + 2);

    const eventDate = new Date(item.eventDate);

    if (eventDate <= secondCutOff) {
        return "text-red-700";
    } else if (eventDate <= firstCutOff) {
        return "text-yellow-700";
    }
    return "";
}