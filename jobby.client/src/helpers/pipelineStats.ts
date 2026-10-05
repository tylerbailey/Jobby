import { Status } from "@/consts/consts";
import type { Application, Stage } from "@/types";

/** Applications with no scheduled event are flagged after this many days. */
export const FOLLOW_UP_AFTER_DAYS = 7;

export type PipelineNextEvent = {
    title: string;
    date: Date;
};

export type PipelineSummary = {
    total: number;
    inProgress: number;
    applied: number;
    appliedThisWeek: number;
    offers: number;
    rejected: number;
    upcoming: number;
    nextEvent: PipelineNextEvent | null;
    followUps: number;
    /** Accepted applications that also have an apply date. */
    offersAmongApplied: number;
    /** Rejected applications that also have an apply date. */
    rejectedAmongApplied: number;
};

/** Returns a date truncated to local midnight. */
function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Returns local midnight a number of days before the given day. */
function daysBefore(day: Date, days: number) {
    const next = new Date(day);
    next.setDate(next.getDate() - days);
    return next;
}

/** Parses an application or event date, ignoring missing and invalid values. */
function parseDate(value?: string | Date | null) {
    if (value === undefined || value === null || value === "")
        return null;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()))
        return null;

    return date;
}

/** Rounds a part-to-whole share to a percentage, or returns null when there is no whole. */
export function formatShare(part: number, whole: number) {
    if (whole <= 0)
        return null;

    return Math.round((part / whole) * 100);
}

/** Counts pipeline outcomes, recent applications, upcoming events, and stale follow-ups. */
export function summarizePipeline(stages: Stage[], now = new Date()): PipelineSummary {
    const apps = stages.flatMap((stage) => stage.items ?? []);
    const today = startOfDay(now);
    const weekStart = daysBefore(today, 6);
    const followUpOnOrBefore = daysBefore(today, FOLLOW_UP_AFTER_DAYS);

    let inProgress = 0;
    let applied = 0;
    let appliedThisWeek = 0;
    let offers = 0;
    let rejected = 0;
    let upcoming = 0;
    let followUps = 0;
    let offersAmongApplied = 0;
    let rejectedAmongApplied = 0;
    let nextEvent: PipelineNextEvent | null = null;

    for (const app of apps) {
        const appliedDate = parseDate(app.appliedDate);
        const hasApplied = appliedDate !== null;
        const upcomingEvents = upcomingEventsFor(app, now);

        if (app.status === Status.InProgress)
            inProgress += 1;
        else if (app.status === Status.Accepted)
            offers += 1;
        else if (app.status === Status.Rejected)
            rejected += 1;

        if (hasApplied) {
            applied += 1;
            const appliedDay = startOfDay(appliedDate);
            if (appliedDay >= weekStart && appliedDay <= today)
                appliedThisWeek += 1;
            if (app.status === Status.Accepted)
                offersAmongApplied += 1;
            if (app.status === Status.Rejected)
                rejectedAmongApplied += 1;
        }

        upcoming += upcomingEvents.length;
        for (const event of upcomingEvents) {
            if (!nextEvent || event.date < nextEvent.date)
                nextEvent = event;
        }

        if (needsFollowUp(app, appliedDate, upcomingEvents.length, followUpOnOrBefore))
            followUps += 1;
    }

    return {
        total: apps.length,
        inProgress,
        applied,
        appliedThisWeek,
        offers,
        rejected,
        upcoming,
        nextEvent,
        followUps,
        offersAmongApplied,
        rejectedAmongApplied,
    };
}

/** Collects events that have not started yet. */
function upcomingEventsFor(app: Application, now: Date) {
    const events: PipelineNextEvent[] = [];

    for (const event of app.events ?? []) {
        const date = parseDate(event.eventDate);
        if (!date || date < now)
            continue;

        events.push({
            title: event.eventTitle?.trim() || "Event",
            date,
        });
    }

    return events;
}

/** An in-progress application needs a follow-up when it was sent long enough ago and nothing is scheduled. */
function needsFollowUp(app: Application, appliedDate: Date | null, upcomingCount: number, followUpOnOrBefore: Date) {
    if (app.status !== Status.InProgress || !appliedDate || upcomingCount > 0)
        return false;

    return startOfDay(appliedDate) <= followUpOnOrBefore;
}
