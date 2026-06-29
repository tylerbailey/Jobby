import type { Application } from "@/types";
import { atsColors, Status } from "@/consts/consts";

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

export function getCardColor(item: Application) {
    switch (item.status) {
        case Status.Rejected:
            return "bg-red-50";
        case Status.Accepted:
            return "bg-green-50"
    }
}
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

export function calculateRiskColors(riskLevel: string) {
    switch (riskLevel) {
        case "Low":
            return "text-green-500";

        case "Medium":
            return "text-yellow-500";

        case "High":
            return "text-red-500";

        default:
            return "";
    }
}