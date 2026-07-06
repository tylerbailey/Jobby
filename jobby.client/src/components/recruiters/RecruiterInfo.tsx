import InfoField from "@/components/ui/info-field";
import { Field, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDate } from "@/helpers/formatHelpers";
import type { Recruiter } from "@/types";
import type { Dispatch, SetStateAction } from "react";

export type RecruiterInfoProps = {
    recruiter: Recruiter;
    infoOpen: boolean;
    setInfoOpen: Dispatch<SetStateAction<boolean>>;
};

function getInitials(name: string) {
    return name.split(" ").map((part) => part[0]).join("").toUpperCase();
}

export default function RecruiterInfo({ recruiter, infoOpen, setInfoOpen }: RecruiterInfoProps) {
    return (
        <Sheet open={infoOpen} onOpenChange={setInfoOpen}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Recruiter Details</SheetTitle>
                    <SheetDescription>
                        Review this recruiter contact here.
                    </SheetDescription>
                </SheetHeader>
                <div className="px-4">
                    <div className="flex items-center gap-3 py-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {getInitials(recruiter.name)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate font-semibold">{recruiter.name}</h3>
                            <p className="truncate text-sm text-muted-foreground">{recruiter.agency}</p>
                        </div>
                    </div>

                    <InfoField label="Name" value={recruiter.name} />
                    <InfoField label="Agency" value={recruiter.agency} />
                    <InfoField label="Email" value={recruiter.email} />
                    <InfoField label="Phone Number" value={recruiter.phoneNumber} />
                    <InfoField label="Last Contact" value={recruiter.lastContact ? formatDate(recruiter.lastContact) : undefined} />
                    <InfoField label="Next Contact" value={recruiter.nextContact ? formatDate(recruiter.nextContact) : undefined} />
                    {recruiter.notes && (
                        <Field className="py-3">
                            <FieldLabel>Notes</FieldLabel>
                            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
                                {recruiter.notes}
                            </div>
                        </Field>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
