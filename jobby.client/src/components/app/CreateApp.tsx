import AppForm from "@/components/app/AppForm";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Status } from "@/consts/consts";
import { resolveLocationTypeId } from "@/helpers/jobPostingHelpers";
import { createNewApp, getAllAppLocations, scrapeJobPosting } from "@/services/appService";
import type { Application } from "@/types";
import axios from "axios";
import { Link2, Loader2, PenLine } from "lucide-react";
import { useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

export type AppCreateProps = {
    stage?: number | null;
    sheetOpen: boolean;
    setSheetOpen: Dispatch<SetStateAction<boolean>>
    onUpdate: () => void;
}

type CreateStep = "choose" | "scrape" | "scraping" | "form";

function createEmptyApplication(stage?: number | null): Application {
    return {
        id: null,
        userId: "",
        companyName: "",
        jobTitle: "",
        summary: "",
        jobPostingUrl: "",
        locationTypeId: 0,
        locationType: "",
        address: null,
        salary: null,
        contactName: null,
        stageId: stage ?? null,
        notes: null,
        status: Status.InProgress,
        isArchived: false,
        appliedDate: null,
        createdDate: null,
        events: [],
        recruiter: {
            id: null,
            name: "",
            agency: "",
            notes: "",
            email: "",
            phoneNumber: "",
            lastContact: null,
            nextContact: null,
            applicationIds: [],
        },
    };
}

export default function CreateApp({ stage, onUpdate, sheetOpen, setSheetOpen }: AppCreateProps) {
    const [step, setStep] = useState<CreateStep>("choose");
    const [scrapeUrl, setScrapeUrl] = useState("");
    const [item, setItem] = useState<Application>(() => createEmptyApplication(stage));

    function handleOpenChange(open: boolean) {
        setSheetOpen(open);
        if (open) {
            setStep("choose");
            setScrapeUrl("");
            setItem(createEmptyApplication(stage));
        }
    }

    async function handleScrape() {
        const url = scrapeUrl.trim();
        if (!url) {
            toast.error("Enter a job posting URL first.");
            return;
        }

        setStep("scraping");
        try {
            const [posting, locationsResponse] = await Promise.all([
                scrapeJobPosting(url),
                getAllAppLocations(),
            ]);
            const locationTypeId = resolveLocationTypeId(posting, locationsResponse.data);

            setItem({
                ...createEmptyApplication(stage),
                jobPostingUrl: url,
                companyName: posting.company,
                jobTitle: posting.title,
                summary: posting.summary,
                locationTypeId: locationTypeId ?? 0,
            });
            setStep("form");
        } catch (err) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message ?? "Could not scrape the job posting."
                : "Could not scrape the job posting.";
            toast.error(message);
            setStep("scrape");
        }
    }

    async function saveApp() {
        try {
            await createNewApp(item);
            onUpdate();
            setSheetOpen(false);
        }
        catch {
            toast.error("An error occured creating the application.")
        }
    }

    return (
        <Sheet open={sheetOpen} onOpenChange={handleOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Application</SheetTitle>
                </SheetHeader>

                {step === "choose" && (
                    <div className="flex flex-col gap-3 px-4 py-2">
                        <p className="text-sm text-muted-foreground">
                            How would you like to add this application?
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-auto items-start gap-3 px-4 py-4 text-left"
                            onClick={() => setStep("scrape")}
                        >
                            <Link2 className="mt-0.5 h-5 w-5 shrink-0" />
                            <span>
                                <span className="block font-medium">Scrape from URL</span>
                                <span className="block text-sm font-normal text-muted-foreground">
                                    Paste a job posting link and auto-fill the details.
                                </span>
                            </span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-auto items-start gap-3 px-4 py-4 text-left"
                            onClick={() => setStep("form")}
                        >
                            <PenLine className="mt-0.5 h-5 w-5 shrink-0" />
                            <span>
                                <span className="block font-medium">Enter details yourself</span>
                                <span className="block text-sm font-normal text-muted-foreground">
                                    Fill in the application form manually.
                                </span>
                            </span>
                        </Button>
                    </div>
                )}

                {step === "scrape" && (
                    <div className="px-4 py-2">
                        <Field className="py-3">
                            <FieldLabel htmlFor="create-app-scrape-url">Job posting URL</FieldLabel>
                            <FieldDescription>
                                We will scrape the page and extract the job details for you.
                            </FieldDescription>
                            <Input
                                id="create-app-scrape-url"
                                type="url"
                                placeholder="https://..."
                                value={scrapeUrl}
                                onChange={(e) => setScrapeUrl(e.target.value)}
                                autoFocus
                            />
                        </Field>
                        <SheetFooter className="mt-4 flex-row justify-between sm:justify-between">
                            <Button type="button" variant="ghost" onClick={() => setStep("choose")}>
                                Back
                            </Button>
                            <Button type="button" onClick={handleScrape}>
                                Continue
                            </Button>
                        </SheetFooter>
                    </div>
                )}

                {step === "scraping" && (
                    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="font-medium">Scraping job posting...</p>
                        <p className="text-sm text-muted-foreground">
                            This may take a minute while we load the page and extract details.
                        </p>
                    </div>
                )}

                {step === "form" && (
                    <AppForm
                        embedded
                        title="Create Application"
                        item={item}
                        setItem={setItem}
                        action={saveApp}
                        header={
                            <div className="px-4 pb-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="-ml-2"
                                    onClick={() => setStep("choose")}
                                >
                                    Back
                                </Button>
                            </div>
                        }
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
