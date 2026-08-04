import type { Application } from "@/types";
import { atsColors, Status } from "@/consts/consts";

/** Maps a location type string to a badge display variant. */
export function getBadgeVariant(type: string): "default" | "secondary" | "outline" {
    switch (type?.toLowerCase()) {
        case "remote":
            return "secondary";
        case "hybrid":
            return "outline";
        case "on-site":
            return "default";
        default:
            return "secondary";
    }
}

/** Returns a background color class for an application card based on its status. */
export function getCardColor(item: Application) {
    switch (item.status) {
        case Status.Rejected:
            return "bg-red-50";
        case Status.Accepted:
            return "bg-green-50"
    }
}
/** Maps an ATS score to its corresponding display color. */
export function calculateScoreColor(score: number) {
    if (score <= 24) {
        return atsColors.terrible
    }
    else if (score >= 25 && score < 50)
        return atsColors.poor
    else if (score >= 50 && score < 90)
        return atsColors.good
    else
        return atsColors.excellent
}

/** Maps a risk level to its corresponding text color class. */
export function calculateRiskColors(riskLevel: number) {
    switch (riskLevel) {
        case 0:
            return "text-green-500";

        case 1:
            return "text-yellow-500";

        case 2:
            return "text-red-500";

        default:
            return "";
    }
}