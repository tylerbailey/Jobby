import type { ResumeAnalysisResponse } from "@/types";
import AtsScore from "./AtsScore";
import AtsScoreBreakdown from "./AtsScoreBreakdown";
import AtsTabs from "./AtsTabs";

export type AtsScoreReportProps = {
    report: ResumeAnalysisResponse;
}

/** Renders the full ATS analysis report combining score, breakdown, and detail tabs. */
export default function AtsScoreReport({report }:AtsScoreReportProps) {




    return (
        <div>
            <div className="flex md:flex-row md:justify-center py-4 flex-col ">
                <div className="pb-4 md:px-4">
                    <AtsScore overallScore={report.overallScore} atsFindings={report.atsFindings} recommendation={report.recommendation} />
                </div>
                <div className="md:w-250 w-full">
                    <AtsScoreBreakdown scores={report.scores} />
                </div>

            </div>
            <div className="w-full">
                <AtsTabs report={report} />
            </div>
        </div>
    );
}
