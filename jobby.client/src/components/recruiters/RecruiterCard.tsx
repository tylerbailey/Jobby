import { Building, Clock, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDate } from "@/helpers/formatHelpers";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import type { Recruiter } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteRecruiter } from "@/services/recruiterService";
import { useState } from "react";
import { toast } from "sonner";
import EditRecruiter from "./EditRecruiter";
import RecruiterInfo from "./RecruiterInfo";


export type RecruiterCardProps = {
    recruiter: Recruiter
    onUpdate: () => void;
}

/** Renders a card summarizing a recruiter contact with edit and delete actions. */
export default function RecruiterCard({ recruiter, onUpdate }: RecruiterCardProps) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    /** Derives initials from the recruiter's full name. */
    function getInitials(name: string) {
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    }

    /** Opens the edit dialog for the recruiter. */
    function handleEdit() {
        setMenuOpen(false);
        setDialogOpen(true);
    }

    /** Deletes the recruiter after verifying it has been saved. */
    async function handleDelete() {
        if (recruiter.id == null) {
            toast.error("This recruiter has not been saved yet.")
            return;
        }

        await deleteRecruiter(recruiter.id)
        setMenuOpen(false);
        onUpdate();
        toast.info("Recruiter has been deleted.")
    }

    return (
        <div className="py-3">
            <Card
                className="flex w-full cursor-pointer justify-center border-none bg-stone-100 shadow-none ring-0 transition hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => setInfoOpen(true)}
            >
                <CardHeader>
                    {
                        <div className="flex min-w-0 items-start justify-between gap-2">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-medium shrink-0 bg-primary/10 text-sm font-bold text-primary`}>
                                    {getInitials(recruiter.name)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-small font-semibold truncate">{recruiter.name}</p>
                                    <p className="text-small flex items-center gap-1 truncate">
                                        <Building className="h-2.5 w-2.5 shrink-0" />
                                        {recruiter.agency}
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
                    }
                </CardHeader>
                <CardContent>

                    <div className="space-y-1">
                        {recruiter.phoneNumber &&
                            (<div className="flex items-center gap-1 text-small">
                                <Phone className="h-3 w-3 shrink-0" />
                                <span>{recruiter.phoneNumber}</span>
                            </div>)}
                        {recruiter.lastContact && (
                            <div className="flex items-center gap-1 text-small">
                                <Clock className="h-3 w-3 shrink-0" />
                                <span>Last: {formatDate(recruiter.lastContact)}</span>
                            </div>
                        )}
                        {recruiter.nextContact && (
                            <div className="flex items-center gap-1 text-small text-green-600">
                                <Clock className="h-3 w-3 shrink-0" />
                                Next: {formatDate(recruiter.nextContact)}
                            </div>)}
                        {(recruiter.notes && (
                            <div className="flex items-center gap-1">
                                <HoverCard>
                                    <HoverCardTrigger><Badge>Notes</Badge></HoverCardTrigger>
                                    <HoverCardContent>
                                        {recruiter.notes}
                                    </HoverCardContent>
                                </HoverCard>
                            </div>))
                        }
                    </div>
                </CardContent>

            </Card>
            <RecruiterInfo recruiter={recruiter} infoOpen={infoOpen} setInfoOpen={setInfoOpen} />
            <EditRecruiter formItem={recruiter} onUpdate={onUpdate} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
        </div>
    );
}
