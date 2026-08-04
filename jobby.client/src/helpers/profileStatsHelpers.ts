import { getArchivedApps, getAllApps } from "@/services/appService";
import type { Application, DailyStat, ProfileStats } from "@/types";

const WINDOW_DAYS = 30;

/** Formats a date as a local YYYY-MM-DD key string. */
function formatLocalDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/** Returns a new Date truncated to the start of the local day. */
function startOfLocalDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Parses an application date value, returning null if it is missing or invalid. */
function parseAppDate(value?: string | Date | null) {
    if (value === undefined || value === null || value === "")
        return null;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime()) || date.getFullYear() < 2000)
        return null;

    return date;
}

/** Converts an application date value into a local date key string. */
function toLocalDateKey(value?: string | Date | null) {
    const date = parseAppDate(value);
    if (!date)
        return null;

    return formatLocalDateKey(date);
}

/** Fetches and combines active and archived applications. */
async function getAllApplications() {
    const [appsResponse, archivedResponse] = await Promise.all([
        getAllApps(),
        getArchivedApps(),
    ]);

    return [...appsResponse.data, ...archivedResponse.data];
}

/** Builds daily and total profile statistics from the user's applications over a rolling window. */
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

/** Counts applications created on a given day. */
function countAddedOnDay(apps: Application[], dateKey: string) {
    return apps.filter((app) => toLocalDateKey(app.createdDate) === dateKey).length;
}

/** Counts applications applied to on a given day. */
function countAppliedOnDay(apps: Application[], dateKey: string) {
    return apps.filter((app) => toLocalDateKey(app.appliedDate) === dateKey).length;
}

/** Normalizes profile stats data from either camelCase or PascalCase API responses. */
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

/** Formats a date key into a short chart-friendly day label. */
export function formatChartDayLabel(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
    });
}

/** @deprecated Use buildProfileStatsFromApplications */
export const buildProfileStatsFromPipeline = buildProfileStatsFromApplications;
