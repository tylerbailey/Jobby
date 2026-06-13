export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}


export function formatDate(date?: Date) {
    if (!date) return undefined;
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(new Date(date));
}
