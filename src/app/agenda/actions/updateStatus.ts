"use server"

import { updateTaskStatus as updateTaskStatusById } from "@/lib/actions/updateTask"

const validStatus = ["pending", "in_progress", "done"] as const;

export async function updateTaskStatus(formData: FormData) {
    const taskId = formData.get("taskId")?.toString().trim();
    const status = formData.get("status")?.toString().trim() as
        | typeof validStatus[number]
        | undefined;

    if (!taskId) throw new Error("ID da tarefa não fornecido.");

    if (!status || !validStatus.includes(status)) {
        throw new Error("Status inválido.");
    }

    try {
        await updateTaskStatusById(taskId, status);
    } catch (error) {
        console.error("Erro ao atualizar status da tarefa:", error);
        throw new Error("Não foi possível atualizar o status da tarefa.");
    }

    
}