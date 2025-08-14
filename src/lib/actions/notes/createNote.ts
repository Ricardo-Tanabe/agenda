"use server";

import { prisma } from "@/lib/prisma";
import { getUserIdOrThrow } from "@/lib/auth/getUserIdOrThrow";

export async function createNote(taskId: string, noteText: string) {
    try {
        const userId = await getUserIdOrThrow();

        if (!taskId || !noteText.trim()) {
            throw new Error("ID da tarefa e texto da nota são obrigatórios.")
        }
    
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: { userId: true },
        });

        if (!task) throw new Error("Tarefa não encontrada.");
    
        if (task.userId !== userId) {
            throw new Error("Você não tem permissão para adicionar nota a esta tarefa.");
        }
    
        await prisma.note.create({
            data: {
                note: noteText.trim(),
                taskId,
            },
        });

        return { success: true}
    } catch (error) {
        console.error("Erro ao criar nota:", error);
        return { error: "Erro ao criar nota. Tente novamente." };
    }
}