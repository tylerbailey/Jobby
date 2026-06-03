import type { Application } from "@/types";

export type KanbanColumnProps = {
    title: string;
    color: string;
    stage: number;
    items: Application[];
    onUpdate: () => void;
};

export type KanbanCardProps = {
    item: Application;
}