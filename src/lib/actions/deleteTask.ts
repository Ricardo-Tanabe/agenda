"use server";

import { prisma } from '@/lib/prisma';
import { getUserIdOrThrow } from '../auth/getUserIdOrThrow';
import { revalidatePath } from 'next/cache';

export async function deleteTask(taskId: string) {
    try {
        const userId = await getUserIdOrThrow();
    
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) throw new Error("Tarefa não encontrada");
    
        if (task.userId !== userId) {
            throw new Error("Você não tem permissão para excluir esta tarefa.");
        }
    
        await prisma.note.deleteMany({
            where: { taskId }
        })
        
        await prisma.task.delete({
            where: { id: taskId },
        });
    
        revalidatePath("/agenda");
        return { success: true};
    } catch (error) {
        console.error("Erro ao excluir tarefa", error);
        return { error: "Erro ao excluir a tarefa. Tente novamente." };
    }
}