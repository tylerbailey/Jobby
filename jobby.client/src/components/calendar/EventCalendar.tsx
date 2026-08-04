import { getUserEvents } from '@/services/eventService';
import type { EventItem } from '@/types';
import FullCalendar, { useCalendarController } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/monarch/theme.css';
import '@fullcalendar/react/themes/monarch/palettes/purple.css'
import themePlugin from "@fullcalendar/react/themes/monarch";
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import AddEvent from './AddEvent';
import EventInfo from './EventInfo';

export default function EventCalendar() {
    const [calendarEvents, setCalendarEvents] = useState<EventItem[]>([])
    const [selectedEvent, setSelectedEvent] = useState<EventItem>();
    const [infoOpen, setInfoOpen] = useState<boolean>(false);
    const [addEventOpen, setAddEventOpen] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(0);
    const controller = useCalendarController();

    function handleRefresh() {
        setRefresh(refresh + 1);
    }
    useEffect(() => {
        async function loadUserEvents() {
            const userEvents = await getUserEvents();
            setCalendarEvents(userEvents.data);
        }
        loadUserEvents();
    }, [refresh])

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 pb-3">
                <h1 className="text-4xl font-bold tracking-tight">
                    Events Calendar
                </h1>
                <Button size="icon" onClick={() => setAddEventOpen(true)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <FullCalendar
                controller={controller}
                plugins={[themePlugin, dayGridPlugin, interactionPlugin]}
                eventClick={(info) => {
                    const original = calendarEvents.find(e => e.id?.toString() === info.event.id);
                    setSelectedEvent(original);
                    setInfoOpen(true);
                }}
                initialView="dayGridMonth"
                weekends={true}
                height="calc(100vh - 100px)"
                headerToolbar={{
                    center: "title",
                    right: "prev,next today"
                }}
                events={calendarEvents.map(event => ({
                    id: event.id?.toString(),
                    title: event.eventTitle,
                    date: event.eventDate,
                }))} />
            {selectedEvent && (
                <EventInfo onUpdate={handleRefresh} eventItem={selectedEvent} isOpen={infoOpen} setIsOpen={setInfoOpen} />
            )}
            <AddEvent onUpdate={handleRefresh} isOpen={addEventOpen} setIsOpen={setAddEventOpen} />
        </div>
    );
}

