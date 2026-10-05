import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    formatShare,
    summarizePipeline,
    type PipelineSummary,
} from "@/helpers/pipelineStats";
import { cn } from "@/lib/utils";
import type { Stage } from "@/types";
import { format } from "date-fns";
import {
    AlarmClock,
    BadgeCheck,
    CalendarClock,
    CircleDot,
    CircleX,
    Send,
    type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";

type Metric = {
    id: string;
    label: string;
    value: number;
    hint: string;
    description: string;
    icon: LucideIcon;
    iconClassName: string;
    valueClassName?: string;
};

type PipelineStatsProps = {
    stages: Stage[];
    isLoaded: boolean;
};

/** Renders the pipeline summary strip, or placeholders while stages are loading. */
export default function PipelineStats({ stages, isLoaded }: PipelineStatsProps) {
    const summary = useMemo(() => summarizePipeline(stages), [stages]);
    const metrics = useMemo(() => buildMetrics(summary), [summary]);
    const responseRate = formatShare(summary.offersAmongApplied + summary.rejectedAmongApplied, summary.applied);

    if (!isLoaded)
        return <PipelineStatsSkeleton />;

    return (
        <section aria-label="Pipeline summary" className="@container overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10">
            <TooltipProvider delayDuration={400}>
                <ul className="grid grid-cols-2 gap-px bg-border @3xl:grid-cols-3 @7xl:grid-cols-6">
                    {metrics.map((metric) => (
                        <li key={metric.id} className="bg-card">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        tabIndex={0}
                                        className="flex w-full cursor-help items-start gap-3 bg-card px-4 py-3.5 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                                    >
                                        <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg", metric.iconClassName)}>
                                            <metric.icon className="size-4" />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate text-xs font-medium text-muted-foreground">{metric.label}</span>
                                            <span className={cn("mt-1 block text-2xl font-semibold tabular-nums leading-none tracking-tight", metric.valueClassName)}>
                                                {metric.value}
                                            </span>
                                            <span className="mt-1.5 block truncate text-xs text-muted-foreground">{metric.hint}</span>
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">{metric.description}</TooltipContent>
                            </Tooltip>
                        </li>
                    ))}
                </ul>
            </TooltipProvider>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t px-4 py-2.5 text-xs">
                <span className="font-medium text-foreground">Response rate</span>
                {responseRate !== null && (
                    <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <span
                            className="block h-full rounded-full bg-primary"
                            style={{ width: `${responseRate}%` }}
                        />
                    </span>
                )}
                <span className="font-medium text-foreground tabular-nums">
                    {responseRate === null ? "—" : `${responseRate}%`}
                </span>
                <span className="text-muted-foreground">
                    {responseRate === null
                        ? "Send an application to start tracking outcomes."
                        : "Offers and rejections out of applications with an apply date."}
                </span>
            </div>
        </section>
    );
}

/** Builds the six summary cells from a pipeline count. */
function buildMetrics(summary: PipelineSummary): Metric[] {
    const offerRate = formatShare(summary.offersAmongApplied, summary.applied);
    const rejectionRate = formatShare(summary.rejectedAmongApplied, summary.applied);

    return [
        {
            id: "in-progress",
            label: "In progress",
            value: summary.inProgress,
            hint: summary.total === 0 ? "Board is empty" : `${summary.total} on the board`,
            description: "Applications still open. Offers and rejections are counted on their own.",
            icon: CircleDot,
            iconClassName: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
        },
        {
            id: "applied",
            label: "Applied",
            value: summary.applied,
            hint: summary.applied === 0
                ? "None sent yet"
                : summary.appliedThisWeek === 0
                    ? "None in the last 7 days"
                    : `${summary.appliedThisWeek} in the last 7 days`,
            description: "Applications with an apply date, in any status.",
            icon: Send,
            iconClassName: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
        },
        {
            id: "offers",
            label: "Offers",
            value: summary.offers,
            hint: offerRate === null ? "No applications sent" : `${offerRate}% of applied`,
            description: "Applications marked Accepted.",
            icon: BadgeCheck,
            iconClassName: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        },
        {
            id: "rejected",
            label: "Rejected",
            value: summary.rejected,
            hint: rejectionRate === null ? "No decisions yet" : `${rejectionRate}% of applied`,
            description: "Applications marked Rejected.",
            icon: CircleX,
            iconClassName: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
        },
        {
            id: "upcoming",
            label: "Upcoming",
            value: summary.upcoming,
            hint: summary.nextEvent
                ? `${format(summary.nextEvent.date, "MMM d")} · ${summary.nextEvent.title}`
                : "Nothing scheduled",
            description: "Interviews, follow-ups, and other events that have not happened yet.",
            icon: CalendarClock,
            iconClassName: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
        },
        {
            id: "follow-up",
            label: "Follow-up",
            value: summary.followUps,
            hint: summary.followUps === 0 ? "Nothing waiting" : "Applied 7+ days ago",
            description: "In-progress applications sent at least 7 days ago with nothing on the calendar.",
            icon: AlarmClock,
            iconClassName: summary.followUps > 0
                ? "bg-orange-500/15 text-orange-700 dark:text-orange-300"
                : "bg-muted text-muted-foreground",
            valueClassName: summary.followUps > 0 ? "text-orange-700 dark:text-orange-300" : undefined,
        },
    ];
}

/** Renders placeholder cells while pipeline stages are loading. */
function PipelineStatsSkeleton() {
    return (
        <div aria-hidden className="@container overflow-hidden rounded-xl shadow-xs ring-1 ring-foreground/10">
            <div className="grid grid-cols-2 gap-px bg-border @3xl:grid-cols-3 @7xl:grid-cols-6">
            {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="flex gap-3 bg-card px-4 py-3.5">
                    <Skeleton className="size-8 rounded-lg" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-6 w-8" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
}
