import type { Stage } from "@/types";
import { api } from "../api";

export async function CreateStage(stage: Stage) {
    return await api.post<Stage>("/stage/new", stage);
}

export async function GetAllStages() {
    return await api.get<Stage[]>("/stage/pipeline");
}

export async function DeleteStage(stageId: string) {
    return await api.delete("/stage/delete/"+stageId)
}