import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";

export type DateTimePickerProps = {
    dateTime?: string | Date | null;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>
    action: (e) => void;
}

export function DateTimePicker({ dateTime, isOpen, setIsOpen, action }: DateTimePickerProps) {
    const [date, setDate] = useState<Date>(dateTime != undefined ? new Date(dateTime) : dateTime); 

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            if (date) {
                newDate.setHours(date.getHours(), date.getMinutes());
            }
            setDate(newDate);
            action(newDate);
        }
    };

    const handleTimeChange = (
        type: "hour" | "minute" | "ampm",
        value: string
    ) => {
        if (date) {
            const newDate = new Date(date);
            if (type === "hour") {
                newDate.setHours(
                    (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
                );
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
                const currentHours = newDate.getHours();
                newDate.setHours(
                    value === "PM" ? currentHours + 12 : currentHours - 12
                );
            }
            setDate(newDate);
            action(newDate);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={
                        cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )} >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "MM/dd/yyyy hh:mm aa")
                    ) : (
                        <span>MM/DD/YYYY hh:mm aa</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="p-1 flex justify-end">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}><X></X> </Button>
                </div>
                <div className="sm:flex py-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={
                                            date && date.getHours() % 12 === hour % 12
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={
                                            date && date.getMinutes() === minute
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                            handleTimeChange("minute", minute.toString())
                                        }
                                    >
                                        {minute}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                                {["AM", "PM"].map((ampm) => (
                                    <Button
                                        key={ampm}
                                        size="icon"
                                        variant={
                                            date &&
                                                ((ampm === "AM" && date.getHours() < 12) ||
                                                    (ampm === "PM" && date.getHours() >= 12))
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("ampm", ampm)}
                                    >
                                        {ampm}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
                <div className="p-4 flex flex-row justify-between">
                    <Button className="" onClick={() => { setIsOpen(false); }}>Done</Button>
                    <Button className="" onClick={() => { setDate(undefined); action(undefined); }}>Clear</Button>
                </div>

            </PopoverContent>
        </Popover>
    );
}