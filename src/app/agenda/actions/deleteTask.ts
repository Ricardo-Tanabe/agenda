"use server";

import { deleteTask as deleteTaskById } from "@/lib/actions/deleteTask";

export async function deleteTask(formData: FormData) {
    const taskId = formData.get("taskId")?.toString().trim();
    if (!taskId) throw new Error("ID da tarefa não fornecido.");

    try {
        const result = await deleteTaskById(taskId);
        if("error" in result) return { error: result.error }
        return { success: true }
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        return { error: "Não foi possível deletar a tarefa."};
    }
}