import type { Application } from "@/types";
import { Status } from "@/enums/enums";

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

export function getIconColors(color: string) {
    switch (color) {
        case "purple": return "stroke-purple-50 fill-purple-700";
        case "blue": return "stroke-blue-50 fill-blue-700";
        case "amber": return "stroke-amber-50 fill-amber-700";
        case "teal": return "stroke-teal-50 fill-teal-700";
        case "yellow": return "stroke-yellow-50 fill-yellow-700";
        case "green": return "stroke-green-50 fill-green-700";
        case "red": return "stroke-red-50 fill-red-700";
        default: return "stroke-gray-50 fill-gray-700";
    }
}