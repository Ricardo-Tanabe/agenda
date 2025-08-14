"use server";

import { prisma } from "@/lib/prisma";
import { getUserIdOrThrow } from "@/lib/auth/getUserIdOrThrow";

export async function updateNote(noteId: string, newText: string) {
    try {
        const userId = await getUserIdOrThrow();

        if (!noteId || !newText.trim()) {
            throw new Error("ID da nota e novo texto são obrigatórios.");
        }
    
        const note = await prisma.note.findUnique({
            where: { id: noteId },
            include: { task: { select: { userId: true} } },
        });

        if (!note) throw new Error("Nota não encontrada.");
    
        if (note.task.userId !== userId) {
            throw new Error("Você não tem permissão para editar esta nota.");
        }
    
        await prisma.note.update({
            where: { id: noteId },
            data: { note: newText },
        });

        return { success: true }
    } catch (error) {
        console.error("Erro ao atualizar nota", error);
        return { error: "Erro ao atualizar nota. Tente novamente." };
    }
}