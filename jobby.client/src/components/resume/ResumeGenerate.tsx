import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { generateApp } from "@/services/appService";
import type { ResumeGenerationResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ResumeChangesReport from "./ResumeChangesReport";

export default function ResumeGenerate() {
    const [jobPosting, setJobPosting] = useState<string>("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [result, setResult] = useState<ResumeGenerationResponse | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        setResumeFile(file ?? null);
    }

    function handleGenerateAgain() {
        setResult(null);
        setResumeFile(null);
        setJobPosting("");
    }

    async function handleResumeGeneration() {
        if (!resumeFile) {
            toast.warning("You must select a docx file.");
            return;
        }

        if (!jobPosting.trim()) {
            toast.warning("Paste the job posting before generating.");
            return;
        }

        setIsGenerating(true);
        const promise = generateApp(resumeFile, jobPosting);

        toast.promise(promise, {
            loading: "Generating tailored resume...",
            success: () => "Your tailored resume is ready to review.",
            error: "Could not generate the tailored resume.",
        });

        try {
            const response = await promise;
            setResult(response);
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="flex flex-col items-center">
            {!result && (
                <Card className="md:w-150">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Generate Tailored Resume</CardTitle>
                        <CardDescription>
                            Generate a tailored resume for this job.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <Field className="py-3">
                            <FieldLabel>Job Posting</FieldLabel>
                            <FieldDescription>Paste the contents of the job posting.</FieldDescription>

                            <Textarea className="h-80 resize-none overflow-y-auto" onChange={(e) => setJobPosting(e.target.value)}></Textarea>

                        </Field>

                        <div className="flex justify-center">
                            <div className="px-4">
                                <Input className="md:w-80 sm:w-full" type="file" accept=".docx" onChange={(e) => handleFileChange(e)}></Input>
                            </div>
                            <div>
                                <Button type="button" disabled={isGenerating} onClick={handleResumeGeneration}>
                                    {isGenerating ? "Generating..." : "Generate"}
                                </Button>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            )}
            <div className="w-full">
                {result && (
                    <ResumeChangesReport result={result} onGenerateAgain={handleGenerateAgain} />
                )}
            </div>
        </div>
    );
}
