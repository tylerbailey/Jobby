import type { Application } from "@/types";
export type Stage = {
    id?: number;
    name: string;
    order?: number;
    color: string;
    items?: Application[];
}