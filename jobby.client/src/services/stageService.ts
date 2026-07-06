import type { Stage } from "@/types";
import { api } from "@/api";

export async function createStage(stage: Stage) {
    return await api.post<Stage>("/stage/new", stage);
}

export async function updateStage(stage: Stage) {
    return await api.post<Stage>("/stage/update", stage);
}

export async function getAllStages() {
    return await api.get<Stage[]>("/stage/pipeline");
}

export async function deleteStage(stageId: number) {
    await api.delete(`/stage/delete/${stageId}`);
}

export async function reorderStages(stages: { id: number; order: number }[]) {
    await api.post("/stage/reorder", { stages });
}