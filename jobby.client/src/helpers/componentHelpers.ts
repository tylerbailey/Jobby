import type { Application } from "@/types";
import { Status } from "@/consts/consts";

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
