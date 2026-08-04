import type { Stage } from "@/types";
import { api } from "@/api";

/** Creates a new pipeline stage. */
export async function createStage(stage: Stage) {
    return await api.post<Stage>("/stage/new", stage);
}

/** Updates an existing pipeline stage. */
export async function updateStage(stage: Stage) {
    return await api.post<Stage>("/stage/update", stage);
}

/** Fetches all pipeline stages. */
export async function getAllStages() {
    return await api.get<Stage[]>("/stage/pipeline");
}

/** Deletes a pipeline stage by id. */
export async function deleteStage(stageId: number) {
    await api.delete(`/stage/delete/${stageId}`);
}

/** Persists a new ordering for the given stages. */
export async function reorderStages(stages: { id: number; order: number }[]) {
    await api.post("/stage/reorder", { stages });
}