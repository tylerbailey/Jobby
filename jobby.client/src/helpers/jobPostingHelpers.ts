import type { AppLocationType, JobPostingData } from "@/types";

export function resolveLocationTypeId(
    posting: JobPostingData,
    locations: AppLocationType[],
): number | undefined {
    const normalized = locations.map((loc) => ({
        ...loc,
        key: loc.type.toLowerCase().replace(/\s+/g, ""),
    }));

    if (posting.isRemote)
        return normalized.find((loc) => loc.key.includes("remote"))?.id;

    if (posting.isHybrid)
        return normalized.find((loc) => loc.key.includes("hybrid"))?.id;

    if (posting.isOnsite) {
        return normalized.find((loc) =>
            loc.key.includes("onsite")
            || loc.key.includes("on-site")
            || loc.key.includes("inoffice")
            || loc.key.includes("in-person"),
        )?.id;
    }

    return undefined;
}
