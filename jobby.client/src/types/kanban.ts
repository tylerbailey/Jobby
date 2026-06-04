import type { Application } from "@/types";

export type KanbanColumnProps = {
    id: number;
    title: string;
    color: string;
    order: number;
    stage: number;
    items: Application[];
    onUpdate: () => void;
};

export type KanbanCardProps = {
    item: Application;
    onUpdate: () => void;
}