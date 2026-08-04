/** Combines multiple ref callbacks into a single ref callback. */
export function mergeRefs<T>(...refs: Array<(node: T | null) => void>) {
    return (node: T | null) => {
        for (const ref of refs)
            ref(node);
    };
}

export const COLUMN_DRAG_PREFIX = "column-";

/** Checks whether a drag id represents a column rather than a card. */
export function isColumnDragId(id: string) {
    return id.startsWith(COLUMN_DRAG_PREFIX);
}

/** Extracts the stage id encoded in a column drag id. */
export function stageIdFromColumnDragId(id: string) {
    return Number.parseInt(id.slice(COLUMN_DRAG_PREFIX.length), 10);
}

/** Reorders a stages array by moving the source stage to the target stage's position. */
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
