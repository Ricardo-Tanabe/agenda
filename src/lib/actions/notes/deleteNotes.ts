"use server"

import { prisma } from "@/lib/prisma";
import { getUserIdOrThrow } from "@/lib/auth/getUserIdOrThrow";

export async function deleteNote(noteId: string) {
    try {
        const userId = await getUserIdOrThrow();
    
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: { task: { select: { userId: true } } },
        });

        if (!note) throw new Error("Nota não encontrada.");
    
        if (note.task.userId !== userId) {
            throw new Error("Você não tem permissão para excluir esta nota.");
        }
    
        await prisma.note.delete({
            where: { id: noteId },
        })

        return { success: true }
    } catch (error) {
        console.error("Erro ao excluir nota:", error);
        return { error: "Erro ao excluir nota. Tente novamente." };
    }
}