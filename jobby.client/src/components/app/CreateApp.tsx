import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { CreateNewApp, GetAllAppLocations } from "@/services/appService";
import  axios  from "axios"; 
import { useEffect, useState } from "react";
import { useUser } from "@/context/AuthContext";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import type { AppCreateProps, LocationType } from "@/types";


export default function CreateApp({ stage, onUpdate }: AppCreateProps) {
    const [error, setError] = useState("");
    const [jobCompany, setJobCompany] = useState("")
    const [jobTitle, setJobTitle] = useState("")
    const [jobUrl, setJobUrl] = useState("")
    const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
    const [jobLocationTypeId, setJobLocationTypeId] = useState("")
    const [jobAddress, setJobAddress] = useState("")
    const [jobSalary, setJobSalary] = useState("")
    const [open, setOpen] = useState(false);
    const { user } = useUser();

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

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
       
        try {
            if (!user) return;
            await CreateNewApp({
                userId: user.id,               
                companyName: jobCompany,
                title: jobTitle,
                postingUrl: jobUrl,
                locationTypeId: Number.parseInt(jobLocationTypeId) || 0,
                address: jobAddress,
                salary: Number.parseFloat(jobSalary) || 0,
                stageId: stage
            });
            onUpdate();
            setJobCompany("");
            setJobTitle("");
            setJobUrl("");
            setJobLocationTypeId("");
            setJobAddress("");
            setJobSalary("");
            setOpen(false)

        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message;

                setError(message ?? "Create failed. Please try again.");
                return;
            }

            setError("Create failed. Please try again.");
        }
    }
   
    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="mt-3 w-full justify-start text-muted-foreground">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Application
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <form onSubmit={handleSubmit}>
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
                                onChange={(e) => setJobCompany(e.target.value)}
                            />

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
                        <Select value={jobLocationTypeId} onValueChange={(e) => setJobLocationTypeId(e)}>
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
                      
                        <div className="py-3">
                            <Button className="w-full" type="submit">Create Application</Button>
                        </div>
                    </form>
                </PopoverContent>
            </Popover>
            {error }
            
        </div>
    );
}

