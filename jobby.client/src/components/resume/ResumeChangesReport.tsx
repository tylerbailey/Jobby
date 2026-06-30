import { ArrowDown, Download } from "lucide-react";
import type { ResumeGenerationResponse } from "../../types/resume";
import { downloadTailoredResume } from "../../services/appService";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export type ResumeChangesReportProps = {
    result: ResumeGenerationResponse;
    onGenerateAgain: () => void;
};

export default function ResumeChangesReport({ result, onGenerateAgain }: ResumeChangesReportProps) {
    const changeCount = result.changes.length;

    return (
        <div className="w-full space-y-4">
            <Card className="md:w-150 mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">
                        {changeCount === 0
                            ? "No changes needed"
                            : `${changeCount} section${changeCount === 1 ? "" : "s"} updated`}
                    </CardTitle>
                    <CardDescription>
                        {changeCount === 0
                            ? "Your resume already aligns well with this job posting."
                            : "Review the changes below, then download your tailored resume when ready."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-3">
                    <Button onClick={() => downloadTailoredResume(result.documentBase64)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download tailored resume
                    </Button>
                    <Button variant="outline" onClick={onGenerateAgain}>
                        Generate again
                    </Button>
                </CardContent>
            </Card>

            {changeCount > 0 && (
                <Card className="mx-auto w-full max-w-7xl">
                    <CardHeader>
                        <CardTitle>Changes made</CardTitle>
                        <CardDescription>
                            Before and after for each section that was updated.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        {result.changes.map((change) => (
                            <div key={change.id} className="space-y-2">
                                <div className="rounded-md border p-3">
                                    <div className="text-xs font-bold uppercase text-muted-foreground">Before</div>
                                    <div className="mt-1 text-muted-foreground">{change.originalText}</div>
                                </div>
                                <div className="flex justify-center text-muted-foreground">
                                    <ArrowDown className="h-4 w-4" />
                                </div>
                                <div className="rounded-md border border-green-600/40 bg-green-600/5 p-3">
                                    <div className="text-xs font-bold uppercase text-green-600">After</div>
                                    <div className="mt-1">{change.newText}</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
