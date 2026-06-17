import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { formatDate } from "@/helpers/formatHelpers";
import { DeleteEvent } from "@/services/eventService";
import type { EventItem } from "@/types";
import InfoField from "../ui/info-field";

export type EventInfoProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    eventItem: EventItem;
    onUpdate: () => void;
}

export default function EventForm({ eventItem, onUpdate, isOpen, setIsOpen }: EventInfoProps) {

    async function handleDelete() {
        await DeleteEvent(eventItem)
        onUpdate();
        setIsOpen(false);
    }

  return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
              <DialogHeader>
                  <div className="flex min-w-0 flex-1 items-start gap-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {eventItem.application.companyName.slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                          <h3 className="truncate font-semibold leading-tight">
                              {eventItem.application.jobTitle}
                          </h3>
                          <p className="truncate text-sm text-muted-foreground">
                              {eventItem.application.companyName}
                          </p>
                      </div>
                  </div>
              </DialogHeader>
              <InfoField label="Date" value={formatDate(eventItem.eventDate)} />
              <InfoField label="Title" value={eventItem.eventTitle} />
              <InfoField label="Description" value={eventItem.eventDescription} />
              <InfoField label="Contact" value={eventItem.application.contactName } />
              <DialogFooter>
                  <Button className="w-full justify-center" variant="destructive" onClick={handleDelete}>Delete</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
  );
}

