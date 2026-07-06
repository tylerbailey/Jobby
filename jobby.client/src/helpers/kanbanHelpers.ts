export function mergeRefs<T>(...refs: Array<(node: T | null) => void>) {
    return (node: T | null) => {
        for (const ref of refs)
            ref(node);
    };
}

export const COLUMN_DRAG_PREFIX = "column-";
export const COLUMN_DROP_PREFIX = "column-target-";

export function isColumnDragId(id: string) {
    return id.startsWith(COLUMN_DRAG_PREFIX);
}

export function isColumnDropId(id: string) {
    return id.startsWith(COLUMN_DROP_PREFIX);
}

export function stageIdFromColumnDragId(id: string) {
    return Number.parseInt(id.slice(COLUMN_DRAG_PREFIX.length), 10);
}

export function stageIdFromColumnDropId(id: string) {
    return Number.parseInt(id.slice(COLUMN_DROP_PREFIX.length), 10);
}

export function reorderStagesById<T extends { id?: number }>(
    stages: T[],
    sourceStageId: number,
    targetStageId: number,
): T[] {
    const fromIndex = stages.findIndex((stage) => stage.id === sourceStageId);
    const toIndex = stages.findIndex((stage) => stage.id === targetStageId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex)
        return stages;

    const next = [...stages];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
}
