import { format } from "date-fns";

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

export function formatDate(date?: string | Date | null) {
    if (date === undefined || date === null || date === "") return undefined;
    return format(new Date(date), "M/d/yyyy h:mm aa");
}