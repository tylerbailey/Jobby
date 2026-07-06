import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getAllAppLocations, scrapeJobPosting } from "@/services/appService";
import type { Application, AppLocationType, JobPostingData } from "@/types";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export type AppFormProps = {
    title: string;
    item: Application;
    setItem: Dispatch<SetStateAction<Application>>;
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>;
    action: () => void;
    allowScrape?: boolean;
}

function resolveLocationTypeId(
    posting: JobPostingData,
    locations: AppLocationType[],
): number | undefined {
    const normalized = locations.map((loc) => ({
        ...loc,
        key: loc.type.toLowerCase().replace(/\s+/g, ""),
    }));

    if (posting.isRemote)
        return normalized.find((loc) => loc.key.includes("remote"))?.id;

    if (posting.isHybrid)
        return normalized.find((loc) => loc.key.includes("hybrid"))?.id;

    if (posting.isOnsite) {
        return normalized.find((loc) =>
            loc.key.includes("onsite")
            || loc.key.includes("on-site")
            || loc.key.includes("inoffice")
            || loc.key.includes("in-person"),
        )?.id;
    }

    return undefined;
}

export default function AppForm({
    title,
    item,
    setItem,
    sheetOpen,
    setSheetOpen,
    action,
    allowScrape = false,
}: AppFormProps) {
    const [locationTypes, setLocationTypes] = useState<AppLocationType[]>([]);
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>();
    const [isScraping, setIsScraping] = useState(false);

    useEffect(() => {
        async function loadLocations() {
            const response = await getAllAppLocations();
            setLocationTypes(response.data);
        }

        loadLocations();
    }, []);

    async function handleScrape() {
        const url = item.jobPostingUrl.trim();
        if (!url) {
            toast.error("Enter a job posting URL first.");
            return;
        }

        setIsScraping(true);
        try {
            const posting = await scrapeJobPosting(url);
            const locationTypeId = resolveLocationTypeId(posting, locationTypes);

            setItem({
                ...item,
                companyName: posting.company || item.companyName,
                jobTitle: posting.title || item.jobTitle,
                summary: posting.summary || item.summary,
                locationTypeId: locationTypeId ?? item.locationTypeId,
            });
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Could not scrape the job posting."
                : "Could not scrape the job posting.";
            toast.error(message);
        } finally {
            setIsScraping(false);
        }
    }

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <div className="px-4 overflow-y-auto">
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-companyname">Company Name</FieldLabel>
                        <FieldDescription>
                            The name of the company you are applying to.
                        </FieldDescription>
                        <Input
                            id="input-field-companyname"
                            type="text"
                            placeholder="Enter the company name"
                            value={item.companyName}
                            onChange={(e) => setItem({ ...item, companyName: e.target.value })} >
                        </Input>
                    </Field>
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobtitle">Title</FieldLabel>
                        <FieldDescription>
                            The title of the job.
                        </FieldDescription>
                        <Input
                            id="input-field-jobtitle"
                            type="text"
                            placeholder="Enter the job title"
                            value={item.jobTitle}
                            onChange={(e) => setItem({ ...item, jobTitle: e.target.value })}
                        />

                    </Field>
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-summary">Summary</FieldLabel>
                        <FieldDescription>
                            A short summary of the job posting.
                        </FieldDescription>
                        <Textarea
                            id="input-field-summary"
                            className="h-28 resize-none overflow-y-auto"
                            placeholder="Enter a job summary"
                            value={item.summary}
                            onChange={(e) => setItem({ ...item, summary: e.target.value })}
                        />
                    </Field>
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobpostingurl">Url</FieldLabel>
                        <FieldDescription>
                            The URL of the job posting.
                        </FieldDescription>
                        <div className="flex gap-2">
                            <Input
                                id="input-field-jobpostingurl"
                                type="text"
                                placeholder="Enter the job posting URL"
                                className="flex-1"
                                value={item.jobPostingUrl}
                                onChange={(e) => setItem({ ...item, jobPostingUrl: e.target.value })} />
                            {allowScrape && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isScraping}
                                    onClick={handleScrape}
                                >
                                    {isScraping
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : "Scrape"}
                                </Button>
                            )}
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel className="py-3">
                            Location Type
                        </FieldLabel>
                        <FieldDescription>
                            The location where you will you work.
                        </FieldDescription>
                        <Select value={item.locationTypeId.toString()} onValueChange={(e) => setItem({ ...item, locationTypeId: Number.parseInt(e) })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Locations</SelectLabel>
                                    {locationTypes.map((loc) => (
                                        <SelectItem key={"loc-" + loc.id} value={loc.id.toString()}>
                                            {loc.type}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobaddress">Address</FieldLabel>
                        <FieldDescription>
                            The address of the job.
                        </FieldDescription>
                        <Input
                            id="input-field-jobaddress"
                            type="text"
                            placeholder="Enter the job posting address"
                            value={item.address}
                            onChange={(e) => setItem({ ...item, address: e.target.value })} />
                    </Field>
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobsalary">Target Salary</FieldLabel>
                        <FieldDescription>
                            The target salary for the job.
                        </FieldDescription>
                        <Input
                            id="input-field-jobsalary"
                            type="number"
                            placeholder="Enter the target salary"
                            value={item.salary}
                            onChange={(e) => setItem({ ...item, salary: Number.parseInt(e.target.value) })} />
                    </Field>
                    <Field className="py-3">
                        <FieldLabel>
                            Apply Date
                        </FieldLabel>
                        <FieldDescription>
                            The date you applied, if applicable.
                        </FieldDescription>
                        <DateTimePicker dateTime={item.appliedDate} isOpen={datePickerOpen} setIsOpen={setDatePickerOpen} action={(e) => setItem({ ...item, appliedDate: e })} />

                    </Field>

                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobContact">Contact</FieldLabel>
                        <FieldDescription>
                            The contact for the job.
                        </FieldDescription>
                        <Input
                            id="input-field-jobcontact"
                            type="text"
                            placeholder="Enter the contact name"
                            value={item.contactName}
                            onChange={(e) => setItem({ ...item, contactName: e.target.value })} />
                    </Field>
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobnotes">Notes</FieldLabel>
                        <FieldDescription>
                            Notes for the job.
                        </FieldDescription>
                        <Textarea className="h-40 resize-none overflow-y-auto" placeholder="Enter your notes here."
                            value={item.notes}
                            onChange={(e) => setItem({ ...item, notes: e.target.value })} />
                    </Field>
                </div>
                <SheetFooter>
                    <Button onClick={() => action()}>Save</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
