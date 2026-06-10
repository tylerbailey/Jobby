
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { HistoryItems } from "@/types";
import { Circle } from "lucide-react";

export default function JobHistory({ sheetOpen, setSheetOpen, items:histories }: HistoryItems) {
    return (
        <Sheet open={sheetOpen} onOpenChange={ setSheetOpen }>
           
            <SheetContent className="">
                <SheetHeader>
                    <SheetTitle>History</SheetTitle>
                    <SheetDescription>Timeline of application.</SheetDescription>
                </SheetHeader>
                <div className="px-4 overflow-y-auto">
                {histories.map(item => (
                    <div className="flex flex-row">
                        <div className="flex flex-col justify-center items-center px-4">
                            <Circle className={`${getIconColors(item.color)}`} />
                            <div className="border border-gray-200 w-0 h-full"></div>
                        </div>
                        <Card className="px-4">
                            <CardHeader>
                                <CardTitle>
                                    { item.eventTitle}
                                </CardTitle>
                                <CardDescription>
                                    { formatDate(item.eventDate) }
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                { item.eventDescription }
                            </CardContent>
                        </Card>
                    </div> 
                ))}
               </div>
                
            </SheetContent>
        </Sheet>
    );
}
function formatDate(date?: Date) {
    if (!date) return undefined;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(date));
}

function getIconColors(color: string) {
    switch (color) {
        case "purple": return "stroke-purple-50 fill-purple-700";
        case "blue": return "stroke-blue-50 fill-blue-700";
        case "amber": return "stroke-amber-50 fill-amber-700";
        case "teal": return "stroke-teal-50 fill-teal-700";
        case "yellow": return "stroke-yellow-50 fill-yellow-700";
        case "green": return "stroke-green-50 fill-green-700";
        case "red": return "stroke-red-50 fill-red-700";
        default: return "stroke-gray-50 fill-gray-700";
    }
}