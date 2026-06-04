import { CalendarDays, MapPin, MoreVertical, Trash2, File } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/react";
import type { KanbanCardProps } from "@/types"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DeleteApp } from "@/services/appService";
import { EditAppSheet } from "@/components/app/EditApp";
import { Input } from "../ui/input";

export function KanbanCard({ item, onUpdate }: KanbanCardProps) {
    const { ref: dragRef } = useDraggable({
        id: item.id!  // non-null assertion since we know cards have ids
    });

    async function DeleteCard() {
        await DeleteApp(item.id);
        onUpdate();
    }

    return (
        <div ref={dragRef}>
            <Card className="cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="mb-3 flex items-start gap-3 col-span-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                                {item.companyName.slice(0, 1)}
                            </div>

                            <div className="min-w-0">
                                <h3 className="truncate font-semibold leading-tight">
                                    {item.title}
                                </h3>
                                <p className="truncate text-sm text-muted-foreground">
                                    {item.companyName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-1">
                                    <Button
                                        onClick={DeleteCard}
                                        variant="ghost"
                                        className="flex h-9 w-full items-center justify-between px-2">
                                        <span>Delete</span>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <EditAppSheet item={item} onUpdate={onUpdate}></EditAppSheet>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" className="flex h-9 w-full items-center justify-between px-2">
                                                <span>Generate Resume</span>
                                                <File className="h-4 w-4" />
                                            </Button>

                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-1">
                                            <Input type="file"></Input>
                                        </PopoverContent>
                                    </Popover>
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
                    {item.locationTypeId && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.address ?? item.locationType}</span>
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