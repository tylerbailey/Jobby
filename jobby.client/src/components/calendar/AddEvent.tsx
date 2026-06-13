import { useEffect, useState } from "react";
import { GetAllApps } from "../../services/appService";
import type { AddEventProps, Application } from "../../types";
import CalendarPopup from "../ui/calendar-popup";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { CreateEvent } from "../../services/eventService";

function AddEvent({ onUpdate, isOpen, setIsOpen }: AddEventProps) {
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventDate, setEventDate] = useState<Date>();
    const [eventTime, setEventTime] = useState("");
    const [applications, setApplications] = useState<Application[]>();
    const [selectedApp, setSelectedApp] = useState("");

    useEffect(() => {
        async function getApplications() {
            const apps = await GetAllApps();
            setApplications(apps.data)
        }

        getApplications();
    }, [])

    async function handleCreate() {
        const [hours, minutes, seconds] = eventTime.split(":").map(Number);
        const date = new Date(eventDate);
        date.setHours(hours, minutes, seconds);
        await CreateEvent({
            appId: Number.parseInt(selectedApp),
            eventTitle: eventTitle,
            eventDescription: eventDescription,
            eventDate: date,
        })
        onUpdate();
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
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
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
                        onChange={(e) => setEventDescription(e.target.value)}
                    />
                </Field>
                <FieldGroup className="flex-row items-center justify-center">
                    <Field className="py-3">
                        <FieldLabel>
                            Date
                        </FieldLabel>
                        <CalendarPopup value={eventDate} onValueChange={(e) => setEventDate(e)} />
                    </Field>
                    <Field className="w-32">
                        <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                        <Input
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            type="time"
                            id="time-picker-optional"
                            step="1"
                            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                    </Field>
                </FieldGroup>
                <DialogFooter>
                    <Button className="w-full justify-center" onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AddEvent;