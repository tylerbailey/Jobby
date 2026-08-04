import { Card, CardContent } from "@/components/ui/card";
import { calculateRiskColors, calculateScoreColor } from "@/helpers/componentHelpers";
import { RecommendationLevelLabels, RiskLevelLabels, type AtsFindings, type RecommendationLevel } from "@/types";
import { Check, X } from "lucide-react";
import { Label, PolarAngleAxis, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

export type AtsScoreProps = {
    overallScore: number;
    atsFindings: AtsFindings;
    recommendation: RecommendationLevel;

}
/** Renders the overall ATS compatibility score gauge and summary badges. */
function AtsScore({overallScore, atsFindings, recommendation }: AtsScoreProps) {
  return (
      <Card>
          <CardContent>
              <div className="flex flex-row gap-6 items-center">
                  <div className="flex flex-col gap-2">
                      <div className="text-lg font-bold">
                          Resume Compatibility Score
                      </div>

                      <div className="text-muted-foreground">
                          Automated review of formatting, keywords, and recruiter readiness.
                      </div>
                  </div>
                  <div className="w-full">
                      <div className="mx-auto aspect-square max-h-250">
                          <RadialBarChart
                              width={250}
                              height={250}
                              data={[{ overall: overallScore }]}
                              startAngle={0}
                              endAngle={360}
                              outerRadius={90}
                              innerRadius={80}>
                              <PolarGrid
                                  gridType="circle"
                                  radialLines={false}
                                  stroke="none"
                                  className="first:fill-muted last:fill-background"
                                  polarRadius={[90, 80]}
                              />
                              <PolarAngleAxis
                                  type="number"
                                  domain={[0, 100]}
                                  tick={false}
                              />
                              <RadialBar dataKey="overall" fill={calculateScoreColor(overallScore)} cornerRadius={10} />
                              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                  <Label
                                      content={({ viewBox }) => {
                                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                              return (
                                                  <text
                                                      x={viewBox.cx}
                                                      y={viewBox.cy}
                                                      textAnchor="middle"
                                                      dominantBaseline="middle"
                                                  >
                                                      <tspan
                                                          x={viewBox.cx}
                                                          y={viewBox.cy}
                                                          className="fill-foreground text-2xl font-bold"
                                                      >
                                                          {overallScore} / 100
                                                      </tspan>
                                                      <tspan
                                                          x={viewBox.cx}
                                                          y={(viewBox.cy || 0) + 24}
                                                          className="fill-muted-foreground"
                                                      >
                                                          Overall Score
                                                      </tspan>
                                                  </text>
                                              )
                                          }
                                      }}
                                  />
                              </PolarRadiusAxis>
                          </RadialBarChart>
                      </div>
                  </div>
              </div>
              <div className="flex justify-between">
                  <div className="flex flex-col pe-4">
                      <div className="font-bold">
                          ATS Compatability
                      </div>
                      <div>
                          {atsFindings.isATSFriendly ? (
                              <span className="inline-flex items-center gap-1 text-green-600">
                                  <Check className="h-4 w-4" />
                                  Compatible
                              </span>
                          ) : (
                              <span className="inline-flex items-center gap-1 text-red-600">
                                  <X className="h-4 w-4" />
                                  Not Compatible
                              </span>
                          )}
                      </div>
                  </div>
                  <div className="flex flex-col">
                      <div className="font-bold">
                          ATS Risk
                      </div>
                      <div className={`${calculateRiskColors(atsFindings.riskLevel)}`}>
                          {RiskLevelLabels[atsFindings.riskLevel]}
                      </div>
                  </div>
                  <div className="flex flex-col">
                      <div className="font-bold">
                          Recommendation
                      </div>
                      <div>
                          {RecommendationLevelLabels[recommendation]}
                      </div>
                  </div>
              </div>
          </CardContent>
      </Card>
  );
}

export default AtsScore;