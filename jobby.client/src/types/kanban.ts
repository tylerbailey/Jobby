import type { Application, Stage } from "@/types";

export type KanbanColumnProps = {

    stage: Stage;
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