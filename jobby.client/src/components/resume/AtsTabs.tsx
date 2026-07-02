import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculateRiskColors, calculateScoreColor } from "@/helpers/componentHelpers";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Check, CheckSquare, Square } from "lucide-react";
import type { ResumeAnalysisResponse } from "@/types";
import { Badge } from "@/components/ui/badge";

function AtsTabs({ report }: {report: ResumeAnalysisResponse }) {
    const [checked, setChecked] = useState<Record<string, boolean>>({});
    const toggle = (id: string) => setChecked((c) => ({ ...c, [id]: !c[id] }));
  return (
      <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="atsfindings">ATS Findings</TabsTrigger>
              <TabsTrigger value="bullets">Bullet Rewrites</TabsTrigger>
              <TabsTrigger value="plan">Action Plan</TabsTrigger>
          </TabsList>
          <TabsContent className="mt-6" value="overview">
              <Card>
                  <CardHeader>
                      <CardTitle>Overview</CardTitle>
                      <CardDescription>

                      </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-4">

                      <div>
                          <div className="text-lg font-bold text-foreground">Strengths</div>
                          <ul className="space-y-1 mt-1">
                              {report.summary.strengths.map((s, i) => (
                                  <li key={i} className="flex gap-2">
                                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                      {s}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      <div>
                          <div className="text-lg font-bold text-foreground">Weaknesses</div>
                          <ul className="space-y-1 mt-1">
                              {report.summary.weaknesses.map((s, i) => (
                                  <li key={i} className="flex gap-2">
                                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-500" />
                                      {s}
                                  </li>
                              ))}
                          </ul>
                      </div>

                      <div>
                          <div className="text-lg font-bold text-foreground">Top Improvements</div>
                          <ol className="space-y-1 mt-1">
                              {report.summary.topImprovements.map((s, i) => (
                                  <li key={i} className="flex gap-2">
                                      <span className="font-semibold text-foreground">{i + 1}.</span>
                                      {s}
                                  </li>
                              ))}
                          </ol>
                      </div>
                  </CardContent>
              </Card>

              <Card className="mt-4">
                  <CardHeader>
                      <CardTitle>Section Breakdown</CardTitle>
                      <CardDescription>How each resume section scored individually.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {Object.entries(report.sectionAnalysis).map(([name, info]) => (
                          <div key={name}>
                              <div className="flex items-center justify-between">
                                  <div className="font-semibold capitalize">{name}</div>
                                  <div className="text-sm font-bold" style={{ color: calculateScoreColor(info.score) }}>
                                      {info.score}
                                  </div>
                              </div>
                              <Progress value={info.score} className="h-1.5 mt-1" />
                              <div className="text-sm text-muted-foreground mt-1">{info.feedback}</div>
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent className="mt-6" value="atsfindings">
              <Card>
                  <CardHeader>
                      <CardTitle>ATS Findings</CardTitle>
                      <CardDescription>

                      </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-4">
                      <div>
                          <div className="text-lg font-bold text-foreground">Issues</div>
                          <div className="space-y-3 mt-1">
                              {report.atsFindings.issues.map((issue, i) => (
                                  <div key={i} className="rounded-md border p-3">
                                      <div className="flex items-center gap-2">
                                          <span className="font-semibold text-foreground">{issue.category}</span>
                                          <Badge variant="outline" className={calculateRiskColors(issue.severity)}>
                                              {issue.severity}
                                          </Badge>
                                      </div>
                                      <div className="mt-1">{issue.description}</div>
                                      <div className="mt-1">
                                          <span className="font-semibold text-foreground">Fix: </span>
                                          {issue.recommendation}
                                      </div>
                                  </div>
                              ))}
                              {report.missingSections.length === 0 && (
                                  <div className="flex items-center gap-2 text-green-600">
                                      <Check className="h-4 w-4" />
                                      No missing sections detected.
                                  </div>
                              )}
                          </div>
                      </div>

                      <Separator />

                      <div>
                          <div className="text-lg font-bold text-foreground">Grammar & Tense Flags</div>
                          <div className="space-y-2 mt-1">
                              {report.grammarIssues.map((g, i) => (
                                  <div key={i} className="rounded-md border p-3">
                                      <div className="font-mono text-foreground">"{g.text}"</div>
                                      <div className="mt-1">{g.issue}</div>
                                      <div className="mt-1">{g.suggestion}</div>
                                  </div>
                              ))}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                              {report.spellingIssues.length === 0 ? (
                                  <>
                                      <Check className="h-4 w-4 text-green-600" />
                                      <span className="text-green-600">No spelling issues detected.</span>
                                  </>
                              ) : (
                                  <span>{report.spellingIssues.length} spelling issue(s) found.</span>
                              )}
                          </div>
                      </div>

                      <Separator />

                      <div>
                          <div className="text-lg font-bold text-foreground">Keyword Suggestions</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                              {report.keywordSuggestions.map((k, i) => (
                                  <div key={i} className="flex items-center gap-2 rounded-md border px-3 py-2">
                                      <Badge variant={k.importance === 1 ? "default" : "secondary"}>
                                          {k.keyword}
                                      </Badge>
                                      <span className="text-xs">{k.reason}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent className="mt-6" value="bullets">
              <Card>
                  <CardHeader>
                      <CardTitle>Bullet Rewrites</CardTitle>
                      <CardDescription>
                          Suggested rewrites to strengthen weaker bullet points.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                      {report.bulletPointRecommendations.map((b, i) => (
                          <div key={i} className="space-y-2">
                              <div className="rounded-md border p-3">
                                  <div className="text-xs font-bold uppercase text-muted-foreground">Before</div>
                                  <div className="mt-1 text-muted-foreground">{b.original}</div>
                              </div>
                              <div className="flex justify-center text-muted-foreground">
                                  <ArrowRight className="h-4 w-4" />
                              </div>
                              <div className="rounded-md border border-green-600/40 bg-green-600/5 p-3">
                                  <div className="text-xs font-bold uppercase text-green-600">After</div>
                                  <div className="mt-1">{b.improved}</div>
                              </div>
                              <div className="text-xs text-muted-foreground">{b.reason}</div>
                              {i < report.bulletPointRecommendations.length - 1 && <Separator className="mt-4" />}
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </TabsContent>
          <TabsContent className="mt-6" value="plan">
              <Card>
                  <CardHeader>
                      <CardTitle>Action Plan</CardTitle>
                      <CardDescription>
                          Prioritized fixes, ordered by impact on your score.
                      </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      {([
                          { key: "highPriority", label: "High Priority", color: "text-red-500" },
                          { key: "mediumPriority", label: "Medium Priority", color: "text-yellow-500" },
                          { key: "lowPriority", label: "Low Priority", color: "text-green-600" },
                      ] as const).map((group) => (
                          <div key={group.key}>
                              <div className={`text-sm font-bold uppercase ${group.color}`}>{group.label}</div>
                              <div className="mt-1">
                                  {report.actionPlan[group.key].map((item, i) => {
                                      const id = `${group.key}-${i}`;
                                      const done = !!checked[id];
                                      return (
                                          <button
                                              key={id}
                                              onClick={() => toggle(id)}
                                              className="flex w-full items-start gap-3 rounded-md p-2 text-left hover:bg-muted"
                                          >
                                              <div className="mt-0.5 shrink-0">
                                                  {done ? (
                                                      <CheckSquare className="h-4 w-4 text-green-600" />
                                                  ) : (
                                                      <Square className="h-4 w-4 text-muted-foreground" />
                                                  )}
                                              </div>

                                              <span
                                                  className={`flex-1 text-sm ${done ? "line-through text-muted-foreground" : ""
                                                      }`}
                                              >
                                                  {item}
                                              </span>
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>
                      ))}
                  </CardContent>
              </Card>
          </TabsContent>
      </Tabs> 
  );
}

export default AtsTabs;