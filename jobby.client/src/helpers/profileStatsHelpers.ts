import { getArchivedApps, getAllApps } from "@/services/appService";
import type { Application, DailyStat, ProfileStats } from "@/types";

const WINDOW_DAYS = 30;

function formatLocalDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function startOfLocalDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseAppDate(value?: string | Date | null) {
    if (value === undefined || value === null || value === "")
        return null;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000)
        return null;

    return date;
}

function toLocalDateKey(value?: string | Date | null) {
    const date = parseAppDate(value);
    if (!date)
        return null;

    return formatLocalDateKey(date);
}

async function getAllApplications() {
    const [appsResponse, archivedResponse] = await Promise.all([
        getAllApps(),
        getArchivedApps(),
    ]);

    return [...appsResponse.data, ...archivedResponse.data];
}

export async function buildProfileStatsFromApplications(): Promise<ProfileStats> {
    const apps = await getAllApplications();
    const today = startOfLocalDay(new Date());
    const periodStart = new Date(today);
    periodStart.setDate(periodStart.getDate() - (WINDOW_DAYS - 1));

    const dailyStats: DailyStat[] = [];
    let totalAdded = 0;
    let totalApplied = 0;

    for (let offset = 0; offset < WINDOW_DAYS; offset++) {
        const dayDate = new Date(periodStart);
        dayDate.setDate(dayDate.getDate() + offset);
        const dateKey = formatLocalDateKey(dayDate);

        const added = countAddedOnDay(apps, dateKey);
        const applied = countAppliedOnDay(apps, dateKey);

        totalAdded += added;
        totalApplied += applied;

        dailyStats.push({
            date: dateKey,
            added,
            applied,
        });
    }

    return {
        totalAdded,
        totalApplied,
        dailyStats,
    };
}

function countAddedOnDay(apps: Application[], dateKey: string) {
    return apps.filter((app) => toLocalDateKey(app.createdDate) === dateKey).length;
}

function countAppliedOnDay(apps: Application[], dateKey: string) {
    return apps.filter((app) => toLocalDateKey(app.appliedDate) === dateKey).length;
}

export function normalizeProfileStats(data: ProfileStats & {
    totalActive?: number;
    TotalAdded?: number;
    DailyStats?: DailyStat[];
}): ProfileStats {
    const dailyStats = (data.dailyStats ?? data.DailyStats ?? [])
        .map((point) => ({
            date: point.date ?? "",
            added: point.added ?? (point as DailyStat & { active?: number; Added?: number }).added
                ?? (point as DailyStat & { active?: number }).active
                ?? (point as DailyStat & { Added?: number }).Added
                ?? 0,
            applied: point.applied ?? (point as DailyStat & { Applied?: number }).Applied ?? 0,
        }));

    return {
        totalAdded: data.totalAdded ?? data.TotalAdded ?? data.totalActive ?? 0,
        totalApplied: data.totalApplied ?? 0,
        dailyStats,
    };
}

export function formatChartDayLabel(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

/** @deprecated Use buildProfileStatsFromApplications */
export const buildProfileStatsFromPipeline = buildProfileStatsFromApplications;
