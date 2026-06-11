import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { AppInfoProps } from "@/types";
import { ExternalLink } from "lucide-react";



export default function AppInfo({item, infoOpen, setInfoOpen }:AppInfoProps) {

  return (
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
                          <p className="truncate text-sm text-muted-foreground">{item.jobTitle}</p>
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
                  <InfoField label="Title" value={item.jobTitle} />
                  <InfoField label="Location Type" value={item.locationType} />
                  <InfoField label="Address" value={item.address} />
                  <InfoField label="Target Salary" value={item.salary ? formatCurrency(item.salary) : undefined} />
                  <InfoField label="Apply" value={formatDate(item.appliedDate)} />
                  <InfoField label="Contact" value={item.contactName} />
                  {item.notes && (
                      <Field className="py-3">
                          <FieldLabel>Notes</FieldLabel>
                          <FieldDescription className="whitespace-pre-wrap">
                              {item.notes}
                          </FieldDescription>
                      </Field>
                  )}
              </div>

              {item.jobPostingUrl && (
                  <SheetFooter>
                      <Button asChild variant="outline" className="w-full justify-between">
                          <a href={item.jobPostingUrl} target="_blank" rel="noreferrer">
                              <span>Open Job Posting</span>
                              <ExternalLink className="h-4 w-4" />
                          </a>
                      </Button>
                  </SheetFooter>
              )}
          </SheetContent>
      </Sheet>
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
