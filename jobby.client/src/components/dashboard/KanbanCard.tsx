import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/react";
import type { KanbanCardProps } from "@/types"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
export function KanbanCard({ item }: KanbanCardProps) {

    const { ref: dragRef } = useDraggable({
        id: item.id!  // non-null assertion since we know cards have ids
    });

    return (
        <div ref={dragRef}>
        <Card className="cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-4">
                <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {item.companyName.slice(0,1)}
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
        </div>
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