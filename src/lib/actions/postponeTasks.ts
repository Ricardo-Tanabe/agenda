import { prisma } from "../prisma";

export async function postponeOldTasks(userId: string, today: Date) {
    try {
        const oldTasks = await prisma.task.findMany({
            where: {
                userId,
                status: {
                    not: "done",
                },
                scheduledFor: {
                    lt: today,
                },
            },
        });

        if (oldTasks.length === 0) return [];
    
        const updatedTasks = await Promise.all(
            oldTasks.map((task) =>
                prisma.task.update({
                    where: { id: task.id },
                    data: { scheduledFor: today },
                })
            )
        );
    
        return updatedTasks;
    } catch (error) {
        console.error("Erro ao adiar tarefas antigas:", error);
        throw new Error("Não foi possível adiar as tarefas.")
    }
}