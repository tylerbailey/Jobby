
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDate } from "@/helpers/formatHelpers";
import type { HistoryItem } from "@/types";
import { Circle } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { IconColors } from "@/consts/consts";

export type HistoryProps = {
    items: HistoryItem[];
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
}
/** Renders the sheet showing the timeline of status changes for an application. */
export default function JobHistory({ sheetOpen, setSheetOpen, items:histories }: HistoryProps) {
    return (
        <Sheet open={sheetOpen} onOpenChange={ setSheetOpen }>           
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>History</SheetTitle>
                    <SheetDescription>Timeline of application.</SheetDescription>
                </SheetHeader>
                <div className="px-4 overflow-y-auto">
                {histories.map(item => (
                    <div className="flex flex-row py-3">
                        <div className="flex flex-col justify-center items-center px-4">
                            <Circle className={`${IconColors[item.color]}`} />
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