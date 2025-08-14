"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getUserIdOrThrow } from "../auth/getUserIdOrThrow";
import { isSameDay } from "date-fns";

export async function updateTask(formData: FormData) {
    try {
        const userId = await getUserIdOrThrow();
    
        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string || "";
        const scheduledForStr = new Date(formData.get("scheduledFor") as string);
        const priorityColor = formData.get("priorityColor") as string;

        if (!id || !title || !scheduledForStr || !priorityColor) {
            throw new Error("Campos obrigatórios não preenchidos.")
        }

        const scheduledFor = new Date(scheduledForStr);
        if (isNaN(scheduledFor.getTime())) throw new Error("Data inválida.");
    
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task) throw new Error("Tarefa não encontrada.");

        if (task.userId !== userId) {
            throw new Error("Você não tem permissão para editar esta tarefa.");
        }
    
        await prisma.task.update({
            where: { id },
            data: { 
                title,
                description,
                scheduledFor,
                priorityColor: priorityColor as "red" | "yellow" | "green",
             },
        });
    
        revalidatePath("/agenda");
        
        return { success: true}
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        return {error: "Erro ao atualizar tarefa. Verifique os dados e tente novamente."};
    }
}

export async function updateTaskStatus(taskId: string, newStatus: "pending" | "in_progress" | "done") {
    try {
        const userId = await getUserIdOrThrow();

        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new Error("Tarefa não encontrada.");

        if (task.userId !== userId) {
            throw new Error("Você não tem permissão para atualizar esta tarefa.");
        }

        const now = new Date();
        let completedAt: Date | null = null;

        if (newStatus === "done") {
            completedAt = isSameDay(task.scheduledFor, now)
                ? now
                : new Date(task.scheduledFor)
        }

        await prisma.task.update({
            where: { id: taskId },
            data: {
                status: newStatus,
                completedAt,
            },
        });
    
        revalidatePath("/agenda");
        return { success: true}
    } catch (error) {
        console.error("Erro ao atualizar status da tarefa:", error);
        return { error: "Erro ao atualizar status da tarefa." };
    }
}
