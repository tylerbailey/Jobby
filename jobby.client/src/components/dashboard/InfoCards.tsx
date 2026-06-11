import { Card,  CardContent} from "@/components/ui/card";
import { BriefcaseBusiness, Send, XCircle } from "lucide-react";
import type { KanbanInfoCardProps } from "@/types";

export default function InfoCards({ active, applied, rejected }: KanbanInfoCardProps) {
    return (

            <div className="flex flex-wrap gap-4">
                <Card className="w-50 h-50">
                    <CardContent className="flex flex-col items-center py-6">
                        <div className="mb-4 rounded-full bg-blue-100 p-3">
                            <BriefcaseBusiness className="size-5 text-blue-600" />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Total Active
                        </div>

                        <div className="mt-2 text-5xl font-bold text-blue-600 tabular-nums">
                            {active}
                        </div>
                    </CardContent>
                </Card>

            <Card className="w-50 h-50">
                    <CardContent className="flex flex-col items-center py-6">
                        <div className="mb-4 rounded-full bg-green-100 p-3">
                            <Send className="size-5 text-green-600" />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Applied
                        </div>

                        <div className="mt-2 text-5xl font-bold text-green-600 tabular-nums">
                            {applied}
                        </div>
                    </CardContent>
                </Card>

            <Card className="w-50 h-50">
                    <CardContent className="flex flex-col items-center py-6">
                        <div className="mb-4 rounded-full bg-red-100 p-3">
                            <XCircle className="size-5 text-red-600" />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Rejected
                        </div>

                        <div className="mt-2 text-5xl font-bold text-red-600 tabular-nums">
                            {rejected}
                        </div>
                    </CardContent>
                </Card>
            </div>
    );
}

