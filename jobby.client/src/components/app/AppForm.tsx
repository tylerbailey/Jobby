import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
    applicationFieldLimits,
    hasApplicationFieldErrors,
    validateManualApplication,
    type ApplicationFieldErrors,
} from "@/helpers/applicationFormHelpers";
import { getAllAppLocations } from "@/services/appService";
import type { Application, AppLocationType } from "@/types";
import { useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

export type AppFormProps = {
    title: string;
    item: Application;
    setItem: Dispatch<SetStateAction<Application>>;
    sheetOpen?: boolean;
    setSheetOpen?: Dispatch<SetStateAction<boolean>>;
    action: () => void;
    embedded?: boolean;
    header?: ReactNode;
    enforceFieldRules?: boolean;
}

/** Renders the create/edit form fields for a job application. */
export default function AppForm({
    title,
    item,
    setItem,
    sheetOpen,
    setSheetOpen,
    action,
    embedded = false,
    header,
    enforceFieldRules = false,
}: AppFormProps) {
    const [locationTypes, setLocationTypes] = useState<AppLocationType[]>([]);
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);
    const [fieldErrors, setFieldErrors] = useState<ApplicationFieldErrors>({});

    /** Clears one field error after the user edits that field. */
    function clearFieldError(field: keyof ApplicationFieldErrors) {
        setFieldErrors((current) => ({ ...current, [field]: undefined }));
    }

    /** Saves the application after required fields and length limits pass. */
    function handleSave() {
        if (enforceFieldRules) {
            const errors = validateManualApplication(item);
            setFieldErrors(errors);
            if (hasApplicationFieldErrors(errors))
                return;
        }

        action();
    }

    useEffect(() => {
        /** Loads the available application location types. */
        async function loadLocations() {
            const response = await getAllAppLocations();
            setLocationTypes(response.data);
        }

        loadLocations();
    }, []);

    const formContent = (
        <>
            {header}
            <div className="px-4 overflow-y-auto">
                <Field className="py-3" data-invalid={!!fieldErrors.companyName}>
                    <FieldLabel htmlFor="input-field-companyname">Company Name</FieldLabel>
                    <FieldDescription>
                        The name of the company you are applying to.
                    </FieldDescription>
                    <Input
                        id="input-field-companyname"
                        type="text"
                        placeholder="Enter the company name"
                        maxLength={applicationFieldLimits.companyName}
                        value={item.companyName}
                        aria-invalid={!!fieldErrors.companyName}
                        onChange={(e) => {
                            setItem({ ...item, companyName: e.target.value });
                            clearFieldError("companyName");
                        }} />
                    <FieldError>{fieldErrors.companyName}</FieldError>
                </Field>
                <Field className="py-3" data-invalid={!!fieldErrors.jobTitle}>
                    <FieldLabel htmlFor="input-field-jobtitle">Title</FieldLabel>
                    <FieldDescription>
                        The title of the job.
                    </FieldDescription>
                    <Input
                        id="input-field-jobtitle"
                        type="text"
                        placeholder="Enter the job title"
                        maxLength={applicationFieldLimits.jobTitle}
                        value={item.jobTitle}
                        aria-invalid={!!fieldErrors.jobTitle}
                        onChange={(e) => {
                            setItem({ ...item, jobTitle: e.target.value });
                            clearFieldError("jobTitle");
                        }}
                    />
                    <FieldError>{fieldErrors.jobTitle}</FieldError>
                </Field>
                <Field className="py-3" data-invalid={!!fieldErrors.summary}>
                    <FieldLabel htmlFor="input-field-summary">Summary</FieldLabel>
                    <FieldDescription>
                        A short summary of the job posting.
                    </FieldDescription>
                    <Textarea
                        id="input-field-summary"
                        className="h-28 resize-none overflow-y-auto"
                        placeholder="Enter a job summary"
                        maxLength={applicationFieldLimits.summary}
                        value={item.summary}
                        aria-invalid={!!fieldErrors.summary}
                        onChange={(e) => {
                            setItem({ ...item, summary: e.target.value });
                            clearFieldError("summary");
                        }}
                    />
                    <FieldError>{fieldErrors.summary}</FieldError>
                </Field>
                <Field className="py-3" data-invalid={!!fieldErrors.jobPostingUrl}>
                    <FieldLabel htmlFor="input-field-jobpostingurl">Url</FieldLabel>
                    <FieldDescription>
                        The URL of the job posting.
                    </FieldDescription>
                    <Input
                        id="input-field-jobpostingurl"
                        type="text"
                        placeholder="Enter the job posting URL"
                        maxLength={applicationFieldLimits.jobPostingUrl}
                        value={item.jobPostingUrl}
                        aria-invalid={!!fieldErrors.jobPostingUrl}
                        onChange={(e) => {
                            setItem({ ...item, jobPostingUrl: e.target.value });
                            clearFieldError("jobPostingUrl");
                        }} />
                    <FieldError>{fieldErrors.jobPostingUrl}</FieldError>
                </Field>
                <Field data-invalid={!!fieldErrors.locationTypeId}>
                    <FieldLabel className="py-3">
                        Location Type
                    </FieldLabel>
                    <FieldDescription>
                        The location where you will you work.
                    </FieldDescription>
                    <Select
                        value={item.locationTypeId > 0 ? item.locationTypeId.toString() : undefined}
                        onValueChange={(e) => {
                            setItem({ ...item, locationTypeId: Number.parseInt(e) });
                            clearFieldError("locationTypeId");
                        }}
                    >
                        <SelectTrigger aria-invalid={!!fieldErrors.locationTypeId}>
                            <SelectValue placeholder="Select a location type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Locations</SelectLabel>
                                {locationTypes.map((loc) => (
                                    <SelectItem key={"loc-" + loc.id} value={(loc.id ?? 0).toString()}>
                                        {loc.type}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <FieldError>{fieldErrors.locationTypeId}</FieldError>
                </Field>
                <Field className="py-3" data-invalid={!!fieldErrors.address}>
                    <FieldLabel htmlFor="input-field-jobaddress">Address</FieldLabel>
                    <FieldDescription>
                        The address of the job.
                    </FieldDescription>
                    <Input
                        id="input-field-jobaddress"
                        type="text"
                        placeholder="Enter the job posting address"
                        maxLength={applicationFieldLimits.address}
                        value={item.address ?? ""}
                        aria-invalid={!!fieldErrors.address}
                        onChange={(e) => {
                            setItem({ ...item, address: e.target.value });
                            clearFieldError("address");
                        }} />
                    <FieldError>{fieldErrors.address}</FieldError>
                </Field>
                <Field className="py-3" data-invalid={!!fieldErrors.salary}>
                    <FieldLabel htmlFor="input-field-jobsalary">Target Salary</FieldLabel>
                    <FieldDescription>
                        The target salary for the job.
                    </FieldDescription>
                    <Input
                        id="input-field-jobsalary"
                        type="number"
                        min={0}
                        max={applicationFieldLimits.salary}
                        placeholder="Enter the target salary"
                        value={item.salary ?? ""}
                        aria-invalid={!!fieldErrors.salary}
                        onChange={(e) => {
                            setItem({
                                ...item,
                                salary: e.target.value === "" ? null : Number.parseInt(e.target.value),
                            });
                            clearFieldError("salary");
                        }} />
                    <FieldError>{fieldErrors.salary}</FieldError>
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
                <Field className="py-3" data-invalid={!!fieldErrors.contactName}>
                    <FieldLabel htmlFor="input-field-jobContact">Contact</FieldLabel>
                    <FieldDescription>
                        The contact for the job.
                    </FieldDescription>
                    <Input
                        id="input-field-jobcontact"
                        type="text"
                        placeholder="Enter the contact name"
                        maxLength={applicationFieldLimits.contactName}
                        value={item.contactName ?? ""}
                        aria-invalid={!!fieldErrors.contactName}
                        onChange={(e) => {
                            setItem({ ...item, contactName: e.target.value });
                            clearFieldError("contactName");
                        }} />
                    <FieldError>{fieldErrors.contactName}</FieldError>
                </Field>
                <Field className="py-3" data-invalid={!!fieldErrors.notes}>
                    <FieldLabel htmlFor="input-field-jobnotes">Notes</FieldLabel>
                    <FieldDescription>
                        Notes for the job.
                    </FieldDescription>
                    <Textarea
                        id="input-field-jobnotes"
                        className="h-40 resize-none overflow-y-auto"
                        placeholder="Enter your notes here."
                        maxLength={applicationFieldLimits.notes}
                        value={item.notes ?? ""}
                        aria-invalid={!!fieldErrors.notes}
                        onChange={(e) => {
                            setItem({ ...item, notes: e.target.value });
                            clearFieldError("notes");
                        }} />
                    <FieldError>{fieldErrors.notes}</FieldError>
                </Field>
            </div>
            <SheetFooter>
                <Button type="button" onClick={handleSave}>Save</Button>
            </SheetFooter>
        </>
    );

    if (embedded)
        return formContent;

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                {formContent}
            </SheetContent>
        </Sheet>
    );
}
