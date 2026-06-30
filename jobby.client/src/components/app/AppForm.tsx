import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { getAllAppLocations } from "@/services/appService";
import type { Application, AppLocationType } from "@/types";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export type AppFormProps = {
    title: string;
    item: Application;
    setItem: Dispatch<SetStateAction<Application>>;
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>;
    action: () => void;
}
export default function AppForm({ title, item, setItem, sheetOpen, setSheetOpen, action }: AppFormProps) {
    const [locationTypes, setLocationTypes] = useState<AppLocationType[]>([]);
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

    useEffect(() => {
        async function GetLocations() {
                const response = await getAllAppLocations();
                setLocationTypes(response.data);            
        }
        GetLocations();
    }, []);

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
                        <FieldLabel htmlFor="input-field-jobpostingurl">Url</FieldLabel>
                        <FieldDescription>
                            The URL of the job posting.
                        </FieldDescription>
                        <Input
                            id="input-field-jobpostingurl"
                            type="text"
                            placeholder="Enter the job posting URL"
                            value={item.jobPostingUrl}
                            onChange={(e) => setItem({ ...item, jobPostingUrl: e.target.value })} />
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
