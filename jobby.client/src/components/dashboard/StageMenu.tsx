import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreVertical, Trash2 } from "lucide-react";
import  { Button } from "../ui/button";
import { DeleteStage } from "../../services/stageService";

export function StageMenu({stageId, onUpdate}) {
    function handleDelete() {
        DeleteStage(stageId);
        onUpdate();
    }

  return (
      <Popover>
          <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1">
              <Button
                  onClick={handleDelete}
                  variant="ghost"
                  className="flex h-9 w-full items-center justify-between px-2">
                  <span>Delete</span>
                  <Trash2 className="h-4 w-4" />
              </Button>             
          </PopoverContent>

      </Popover>
  );
}
