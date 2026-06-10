import { format } from "date-fns/format";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Calendar1 } from "lucide-react";
import { Calendar } from "./calendar";

interface DateFieldProps {
    value?: Date;
    onValueChange?: (date?: Date) => void;
}

export default function CalendarPopup({ value, onValueChange }: DateFieldProps) {
    
  return (
      <Popover>
          <PopoverTrigger asChild>
              <Button
                  variant="outline"
                  className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                  {value ? format(value, "PPP") : <span></span>}
                  <Calendar1 />
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                  mode="single"
                  selected={value}
                  onSelect={onValueChange}
                  defaultMonth={value}
              />
          </PopoverContent>
      </Popover>
  );
}