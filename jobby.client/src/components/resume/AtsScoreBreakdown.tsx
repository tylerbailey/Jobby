import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { calculateScoreColor } from "@/helpers/componentHelpers";
import { ScoreTypeLabels, type ScoreBreakdown } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export type AtsScoreBreakdownProps = {
    scores: ScoreBreakdown[];

}
function AtsScoreBreakdown({ scores }: AtsScoreBreakdownProps) {
    const chartConfig = {
        score: {
            label: "Score",
            color: "hsl(var(--chart-1))",
        },
    };

    const chartData = scores.map((s) => ({
        ...s,
        label: ScoreTypeLabels[s.scoreType],
    }));

    return (
        <Card>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 40, right: 20 }}
                        barSize={18}
                    >
                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            tickLine={false}
                            axisLine={false}
                        />

                        <YAxis
                            dataKey="label"
                            type="category"
                            width={160}
                            tickLine={false}
                            axisLine={false}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        <Bar dataKey="score" radius={5}>
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={calculateScoreColor(entry.score)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default AtsScoreBreakdown;