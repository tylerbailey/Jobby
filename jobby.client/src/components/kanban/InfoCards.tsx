import { Card, CardContent } from "@/components/ui/card";

export type KanbanInfoCardProps = {
    active: number;
    applied: number;
    rejected: number;
}
export default function InfoCards({ active, applied, rejected }: KanbanInfoCardProps) {
    return (
        <div className="grid grid-cols-3 gap-3">
            <Card className="flex bg-stone-100 w-50 h-20 justify-center border-none shadow-none ring-0">
                <CardContent className="flex flex-col">
                    <div className="text-3xl font-bold text-blue-900">
                        {active}
                    </div>
                    <div className="text-sm">
                        Active
                    </div>
                </CardContent>
            </Card>
            <Card className="flex bg-stone-100 w-50 h-20 justify-center border-none shadow-none ring-0">
                <CardContent className="flex flex-col">
                    <div className="text-3xl font-bold text-green-900">
                        {applied}
                    </div>
                    <div className="text-sm">
                        Applied
                    </div>
                </CardContent>
            </Card>
            <Card className="flex bg-stone-100 w-50 h-20 justify-center border-none shadow-none ring-0">
                <CardContent className="flex flex-col">
                    <div className="text-3xl font-bold text-red-900">
                        {rejected}
                    </div>
                    <div className="text-sm">
                        Rejected
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

