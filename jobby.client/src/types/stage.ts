import type { Application } from "@/types";

export type Stage = {
    id?: number | null;
    name: string;
    order: number;
    color: string;
    items: Application[];
}
