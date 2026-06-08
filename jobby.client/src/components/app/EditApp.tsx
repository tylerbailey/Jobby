import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { GetAllAppLocations, UpdateApp } from "@/services/appService";
import type { AppEditProps, LocationType } from "@/types";
import { format } from "date-fns/format";
import { Calendar1, ChevronDownIcon, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export function EditAppSheet({ item, onUpdate } : AppEditProps) {
    const [jobCompany, setJobCompany] = useState(item.companyName)
    const [jobTitle, setJobTitle] = useState(item.title)
    const [jobUrl, setJobUrl] = useState(item.postingUrl)
    const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
    const [jobLocationTypeId, setJobLocationTypeId] = useState(item.locationTypeId.toString())
    const [jobAddress, setJobAddress] = useState(item.address)
    const [jobSalary, setJobSalary] = useState(item.salary.toString())
    const [jobNotes, setJobNotes] = useState(item.notes)
    const [applyDate, setApplyDate] = useState<Date>(item.appliedDate)
    const [jobContact, setJobContact] = useState(item.contactName)
    const [lastContact, setLastContact] = useState<Date>(item.lastContactDate)
    const [nextContact, setNextContact] = useState<Date>(item.nextContactDate)
    const [open, setOpen] = useState(false);

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

   async function SaveApp() {
        await UpdateApp({
            id: item.id,
            userId: item.userId,
            companyName: jobCompany,
            title: jobTitle,
            postingUrl: jobUrl,
            locationTypeId: Number.parseInt(jobLocationTypeId) || 0,
            locationType: locationTypes.find(loc => loc.id === Number.parseInt(jobLocationTypeId))?.type || "",
            address: jobAddress,
            salary: Number.parseFloat(jobSalary) || 0,
            stageId: item.stageId,
            appliedDate: applyDate,
            contactName: jobContact,
            lastContactDate: lastContact,
            nextContactDate: nextContact,
            notes: jobNotes
        })
       onUpdate();
       setOpen(false)
    }

  return (
      <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
              <Button
                  variant="ghost"
                  className="flex h-9 w-full items-center justify-between px-2">
                  <span>Edit</span>
                  <Pencil className="h-4 w-4" />
              </Button>
          </SheetTrigger>
          <SheetContent>
              <SheetHeader>
                  <SheetTitle>Edit Application</SheetTitle>
                  <SheetDescription>
                      Make changes to the application here. Click save when you're done.
                  </SheetDescription>
              </SheetHeader>
              <div className="px-4 overflow-y-auto">
              <Field className="py-3">
                  <FieldLabel htmlFor="input-field-companyname">Company Name</FieldLabel>
                  <FieldDescription>
                      Enter the name of the company you are applying to.
                  </FieldDescription>
                  <Input
                      id="input-field-companyname"
                      type="text"
                      placeholder="Enter the company name"
                      value={jobCompany}
                      onChange={(e) => setJobCompany(e.target.value)}>        
                  </Input>

              </Field>
              <Field className="py-3">
                  <FieldLabel htmlFor="input-field-jobtitle">Title</FieldLabel>
                  <FieldDescription>
                      Enter the title of the job.
                  </FieldDescription>
                  <Input
                      id="input-field-jobtitle"
                      type="text"
                      placeholder="Enter the job title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                  />

              </Field>
              <Field className="py-3">
                  <FieldLabel htmlFor="input-field-jobpostingurl">Url</FieldLabel>
                  <FieldDescription>
                      Enter the URL of the job posting.
                  </FieldDescription>
                  <Input
                      id="input-field-jobpostingurl"
                      type="text"
                      placeholder="Enter the job posting URL"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                  />

              </Field>
              <Label className="py-3">
                  Location Type
              </Label>
              <Select value={jobLocationTypeId.toString()} onValueChange={(e) => setJobLocationTypeId(e)}>
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
              <Field className="py-3">
                  <FieldLabel htmlFor="input-field-jobaddress">Address</FieldLabel>
                  <FieldDescription>
                      Enter the address of the job.
                  </FieldDescription>
                  <Input
                      id="input-field-jobpostingurl"
                      type="text"
                      placeholder="Enter the job posting address"
                      value={jobAddress}
                      onChange={(e) => setJobAddress(e.target.value)}
                  />
              </Field>
              <Field className="py-3">
                  <FieldLabel htmlFor="input-field-jobsalary">Target Salary</FieldLabel>
                  <FieldDescription>
                      Enter the salary for the job.
                  </FieldDescription>
                  <Input
                      id="input-field-jobsalary"
                      type="number"
                      placeholder="Enter the target salary"
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                  />
                  </Field>
                  <Label className="py-3">
                  Apply Date
                  </Label>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                              variant="outline"
                              data-empty={!applyDate}
                              className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                          >
                              {applyDate ? format(applyDate, "PPP") : <span>Apply Date</span>}
                              <ChevronDownIcon />
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={applyDate}
                              onSelect={setApplyDate}
                              defaultMonth={applyDate}
                          />
                      </PopoverContent>
                  </Popover>
                  <Field className="py-3">
                      <FieldLabel htmlFor="input-field-jobsalary">Contact</FieldLabel>
                      <FieldDescription>
                          Enter the contact for the job.
                      </FieldDescription>
                      <Input
                          id="input-field-jobcontact"
                          type="text"
                          placeholder="Enter the contact name"
                          value={jobContact}
                          onChange={(e) => setJobContact(e.target.value)}
                      />
                  </Field>
                  <Label className="py-3">
                      Last Contact Date
                  </Label>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                              variant="outline"
                              data-empty={!lastContact}
                              className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                          >
                              {lastContact ? format(lastContact, "PPP") : <span>Last Contact Date</span>}
                              <Calendar1 />
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={lastContact}
                              onSelect={setLastContact}
                              defaultMonth={lastContact}
                          />
                      </PopoverContent>
                  </Popover>
                  <Label className="py-3">
                      Next Contact Date
                  </Label>
                  <Popover>
                      <PopoverTrigger asChild>
                          <Button
                              variant="outline"
                              data-empty={!nextContact}
                              className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground">
                              {nextContact ? format(nextContact, "PPP") : <span>Next Contact Date</span>}
                              <Calendar1 />
                          </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                              mode="single"
                              selected={nextContact}
                              onSelect={setNextContact}
                              defaultMonth={nextContact}
                          />
                      </PopoverContent>
                  </Popover>
                  <Field className="py-3">
                      <FieldLabel htmlFor="input-field-jobnotes">Notes</FieldLabel>
                      <FieldDescription>
                          Enter notes for the job.
                      </FieldDescription>
                      <Textarea placeholder="Enter your notes here."
                          value={jobNotes}
                          onChange={(e) => setJobNotes(e.target.value)}
                      />
                  </Field>
              </div>
              <SheetFooter>
                  <Button onClick={SaveApp}>Save changes</Button>
                  <SheetClose asChild>
                      <Button variant="outline">Close</Button>
                  </SheetClose>
              </SheetFooter>
          </SheetContent>
      </Sheet>
  );
}

