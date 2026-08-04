import { format } from "date-fns";

/** Formats a number as a USD currency string. */
export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

/** Formats a date value into a human-readable date and time string. */
export function formatDate(date?: string | Date | null) {
    if (date === undefined || date === null || date === "") return undefined;
    return format(new Date(date), "M/d/yyyy h:mm aa");
}