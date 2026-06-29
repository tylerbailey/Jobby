import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { generateApp } from "../../services/appService";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function ResumeGenerate() {
    const [jobPosting, setJobPosting] = useState<string>("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        setResumeFile(file ?? null);
    }

    async function handleResumeGeneration() {
        if (resumeFile != null) {
            const promise = generateApp(resumeFile, jobPosting)

            toast.promise(promise, {
                loading: "Generating resume. Your file will automatically download when complete.",
                success: () => "Your resume has been created.",
                error: "Error",
            })

            const blob = await promise

            const url = window.URL.createObjectURL(new Blob([blob]))
            const a = document.createElement("a");
            a.href = url;
            a.download = "TailoredResume.docx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }
        else {
            toast.warning("You must select a docx file.")
        }
    }
    return (
        <div className="flex flex-col items-center">
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
                            <Button onClick={handleResumeGeneration}>Generate</Button>
                            </div>

                    </div>      
                </CardContent>
            </Card>
      </div>
    );
}

