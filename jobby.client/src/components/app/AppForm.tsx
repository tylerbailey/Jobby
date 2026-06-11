import { Button } from "@/components/ui/button";
import CalendarPopup from "@/components/ui/calendar-popup";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { GetAllAppLocations } from "@/services/appService";
import type { AppFormProps, LocationType } from "@/types";
import { useEffect, useState } from "react";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

export default function AppForm({ form, setForm, sheetOpen, setSheetOpen, action }: AppFormProps) {
    const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);

    useEffect(() => {
        async function GetLocations() {
            try {
                const response = await GetAllAppLocations();
                setLocationTypes(response.data);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
            }
        }
        GetLocations();
    }, []);

    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{form.formTitle}</SheetTitle>
                    <SheetDescription>
                        {form.formDesc}
                    </SheetDescription>
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
                            value={form.companyName}
                            onChange={(e) => setForm({ ...form, companyName: e.target.value })} >
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
                            value={form.jobTitle}
                            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                        />

                    </Field>
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobpostingurl">Url</FieldLabel>
                        <FieldDescription>
                            The URL of the job posting.
                        </FieldDescription>
                        <Input
                            id="input-field-jobpostingurl"
                            type="text"
                            placeholder="Enter the job posting URL"
                            value={form.jobPostingUrl}
                            onChange={(e) => setForm({ ...form, jobPostingUrl: e.target.value })} />
                    </Field>
                    <Field>
                        <FieldLabel className="py-3">
                            Location Type
                        </FieldLabel>
                        <FieldDescription>
                            The location where you will you work.
                        </FieldDescription>
                        <Select value={form.locationTypeId.toString()} onValueChange={(e) => setForm({ ...form, locationTypeId: Number.parseInt(e) })}>
                            <SelectTrigger className="w-full max-w-48">
                                <SelectValue placeholder="Select a type" />
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
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })} />
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
                            value={form.salary}
                            onChange={(e) => setForm({ ...form, salary: Number.parseInt(e.target.value) })} />
                    </Field>
                    <Field className="py-3">
                        <FieldLabel>
                            Apply Date
                        </FieldLabel>
                        <FieldDescription>
                            The date you applied, if applicable.
                        </FieldDescription>
                        <CalendarPopup value={form.appliedDate} onValueChange={(e) => setForm({ ...form, appliedDate: e })} />

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
                            value={form.contactName}
                            onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
                    </Field>  
                    <Field className="py-3">
                        <FieldLabel htmlFor="input-field-jobnotes">Notes</FieldLabel>
                        <FieldDescription>
                            Notes for the job.
                        </FieldDescription>
                        <Textarea placeholder="Enter your notes here."
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </Field>
                </div>
                <SheetFooter>
                    <Button onClick={() => action()}>Save</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
