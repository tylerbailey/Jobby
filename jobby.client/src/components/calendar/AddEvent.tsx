import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllApps } from "@/services/appService";
import { createEvent } from "@/services/eventService";
import type { Application } from "@/types";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export type AddEventProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    onUpdate: () => void;
}

export default function AddEvent({ onUpdate, isOpen, setIsOpen }: AddEventProps) {
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
    const [applications, setApplications] = useState<Application[]>();
    const [selectedApp, setSelectedApp] = useState("");
    const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

    useEffect(() => {
        async function getApplications() {
            const apps = await getAllApps();
            setApplications(apps.data)
        }
        getApplications();
    }, [])

    async function handleCreate() {
        if (!eventDate) {
            // Show a validation message
            alert("Please select an event date.");
            return;
        }

        await createEvent({
            appId: Number.parseInt(selectedApp),
            eventTitle: eventTitle,
            eventDescription: eventDescription,
            eventDate: eventDate,
        })
        onUpdate();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                        Create a new event for an application
                    </DialogDescription>
                </DialogHeader>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-field-jobtitle">Application</FieldLabel>
                    <FieldDescription>
                        The application the event is for.
                    </FieldDescription>
                    <Select onValueChange={(e) => setSelectedApp(e)} value={selectedApp}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an application" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Applications</SelectLabel>
                                {applications && applications.map((app) => (
                                    <SelectItem value={app.id.toString()}>{app.companyName} - {app.jobTitle}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-field-jobtitle">Title</FieldLabel>
                    <FieldDescription>
                        The event title.
                    </FieldDescription>
                    <Input
                        id="input-field-title"
                        type="text"
                        placeholder="Enter the event title"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)} />
                </Field>
                <Field className="py-3">
                    <FieldLabel htmlFor="input-field-jobtitle">Description</FieldLabel>
                    <FieldDescription>
                        The event description.
                    </FieldDescription>
                    <Input
                        id="input-field-title"
                        type="text"
                        placeholder="Enter the event title"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)} />
                </Field>
                <DateTimePicker dateTime={eventDate} isOpen={datePickerOpen} setIsOpen={setDatePickerOpen} action={(e) => setEventDate(e)} />
                <DialogFooter>
                    <Button className="w-full justify-center" onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

 