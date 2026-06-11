import type { Application } from "@/types";

export type KanbanColumnProps = {
    id: number;
    title: string;
    color: string;
    order: number;
    stage: number;
    items?: Application[];
    searchValue: string;
    onUpdate: () => void;
};

export type KanbanCardProps = {
    item: Application;
    isMatch: boolean;
    onUpdate: () => void;
}

export type KanbanInfoCardProps = {
    active: number;
    applied: number;
    rejected: number;
}