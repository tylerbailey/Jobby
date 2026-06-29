import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { rateResume } from "../../services/resumeService";
import type { ResumeAnalysisResponse } from "../../types";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import AtsScoreReport from "./AtsScoreReport";

export default function ResumeRating() {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [report, setReport] = useState<ResumeAnalysisResponse | null>(null)
    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        setResumeFile(file ?? null);
    }
    async function handleResumeGeneration() {

        if (resumeFile != null) {

            const promise = rateResume(resumeFile);

            toast.promise(promise, {
                loading: "Generating ATS Report",
                success: () => "Your report has been created",
                error: "Error",
            });

            const response = await promise;
            setReport(response);
        }
        else {
            toast.warning("You must select a docx file.")
        }
    }

    return (
        <div className="flex flex-col items-center">
            {!report && (
            <Card className="md:w-150">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Upload your resume</CardTitle>
                    <CardDescription>
                        Score your resume for ATS compatibility.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <div>
                        <Input className="md:w-80 sm:w-full" type="file" accept=".docx" onChange={(e) => handleFileChange(e)}></Input>
                    </div>
                    <div className="px-4">
                        <Button onClick={handleResumeGeneration}>Generate</Button>
                    </div>
                </CardContent>
            </Card>
            )}
            <div className="w-full">
                {report && (<AtsScoreReport report={report} />)}
            </div>

        </div>
    );
}