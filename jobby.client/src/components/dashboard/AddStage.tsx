import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CreateStage } from "../../services/stageService";

export function AddStage({ onUpdate}) {
    const [name, setName] = useState("");
    const [order, setOrder] = useState("");
    const [color, setColor] = useState("");

    async function handleCreate() {
        await CreateStage({ name, order: parseInt(order), color });
        onUpdate();
    }
  return (
      <Popover>
          <PopoverTrigger asChild>
              <Button variant="outline"><Plus></Plus></Button>
          </PopoverTrigger>
          <PopoverContent>
              <PopoverHeader>
                  <PopoverTitle>New Pipeline Stage</PopoverTitle>
                  <PopoverDescription>Create a new stage for your pipeline.</PopoverDescription>
              </PopoverHeader>
              <Label>Name</Label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <Label>Order</Label>
              <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
              <Label>Color</Label>
              <Select value={color} onValueChange={setColor}>
                  <SelectTrigger className="">
                      <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectGroup>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="amber">Amber</SelectItem>
                          <SelectItem value="teal">Teal</SelectItem>
                          <SelectItem value="yellow">Yellow</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                      </SelectGroup>
                  </SelectContent>
              </Select>
              <Button onClick={handleCreate}>
              Create
              </Button>
          </PopoverContent>
      </Popover>
  );
}

