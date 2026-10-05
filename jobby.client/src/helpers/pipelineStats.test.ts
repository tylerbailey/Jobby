import { Status } from "@/consts/consts";
import { formatShare, summarizePipeline } from "@/helpers/pipelineStats";
import type { Application, Stage } from "@/types";
import { describe, expect, it } from "vitest";

const now = new Date(2026, 9, 5, 15, 0, 0);

function application(overrides: Partial<Application> = {}): Application {
    return {
        userId: "user",
        companyName: "Acme",
        jobTitle: "Engineer",
        summary: "",
        jobPostingUrl: "",
        locationTypeId: 1,
        locationType: "Remote",
        status: Status.InProgress,
        isArchived: false,
        events: [],
        recruiter: {
            id: 0,
            name: "",
            agency: "",
            notes: "",
            email: "",
            phoneNumber: "",
            lastContact: null,
            nextContact: null,
            applicationIds: [],
        },
        ...overrides,
    };
}

function stage(items: Application[]): Stage {
    return { name: "Saved", order: 1, color: "Blue", items };
}

describe("formatShare", () => {
    it("returns null when there is nothing to divide by", () => {
        expect(formatShare(1, 0)).toBeNull();
    });

    it("rounds to the nearest percent", () => {
        expect(formatShare(1, 3)).toBe(33);
    });
});

describe("summarizePipeline", () => {
    it("returns zeros for an empty board", () => {
        expect(summarizePipeline([], now)).toMatchObject({
            total: 0,
            inProgress: 0,
            applied: 0,
            offers: 0,
            rejected: 0,
            upcoming: 0,
            followUps: 0,
            nextEvent: null,
        });
    });

    it("counts open roles, offers, and rejections separately", () => {
        const summary = summarizePipeline([
            stage([
                application({ status: Status.InProgress }),
                application({ status: Status.Accepted, appliedDate: "2026-09-01" }),
                application({ status: Status.Rejected, appliedDate: "2026-09-02" }),
                application({ status: Status.Rejected, appliedDate: "2026-09-03" }),
            ]),
        ], now);

        expect(summary.total).toBe(4);
        expect(summary.inProgress).toBe(1);
        expect(summary.offers).toBe(1);
        expect(summary.rejected).toBe(2);
        expect(summary.offersAmongApplied).toBe(1);
        expect(summary.rejectedAmongApplied).toBe(2);
    });

    it("counts applications sent in the last seven days", () => {
        const summary = summarizePipeline([
            stage([
                application({ appliedDate: new Date(2026, 9, 5, 9) }),
                application({ appliedDate: new Date(2026, 8, 29) }),
                application({ appliedDate: new Date(2026, 8, 28) }),
                application({ appliedDate: "not-a-date" }),
            ]),
        ], now);

        expect(summary.applied).toBe(3);
        expect(summary.appliedThisWeek).toBe(2);
    });

    it("picks the soonest upcoming event and ignores past ones", () => {
        const summary = summarizePipeline([
            stage([
                application({
                    events: [
                        { eventTitle: "Past screen", eventDescription: "", eventDate: new Date(2026, 9, 1, 9) },
                        { eventTitle: "Onsite", eventDescription: "", eventDate: new Date(2026, 9, 8, 9) },
                        { eventTitle: "Phone screen", eventDescription: "", eventDate: new Date(2026, 9, 6, 9) },
                    ],
                }),
            ]),
        ], now);

        expect(summary.upcoming).toBe(2);
        expect(summary.nextEvent?.title).toBe("Phone screen");
    });

    it("flags in-progress applications that have been waiting at least seven days", () => {
        const summary = summarizePipeline([
            stage([
                application({ appliedDate: new Date(2026, 8, 28) }),
                application({ appliedDate: new Date(2026, 8, 29) }),
                application({
                    appliedDate: new Date(2026, 8, 20),
                    events: [{ eventTitle: "Interview", eventDescription: "", eventDate: new Date(2026, 9, 6, 9) }],
                }),
                application({ status: Status.Rejected, appliedDate: new Date(2026, 8, 1) }),
                application({ status: Status.InProgress }),
            ]),
        ], now);

        expect(summary.followUps).toBe(1);
    });
});
