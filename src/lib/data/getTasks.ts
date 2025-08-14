import { prisma } from "@/lib/prisma";

type DateRange = {
    from: string;
    to: string;
}

export async function getTasksByUserId(userId: string, range?: DateRange) {
    try {
        return prisma.task.findMany({
            where: {
                userId,
                ...(range && {
                    scheduledFor: {
                        gte: range.from,
                        lte: range.to,
                    }
                })
            },
            orderBy: { scheduledFor: "desc" },
            include: { notes: true },
        });
    } catch (error) {
        console.error(`Erro ao buscar tarefas do usuário ${userId}`, error);
        throw error;
    }
}

export async function getTaskById(id: string) {
    return prisma.task.findUnique({ where: {id} });
}

export async function getTaskWithNoteById(id: string) {
    return prisma.task.findUnique({
        where: { id },
        include: {
            notes: {
                orderBy: { createdAt: "asc" },
            },
        },
    });
}

export async function getCompletedTasksByDate(userId: string, date: string) {
    const start = new Date(date + "T00:00:00");
    const end = new Date(date + "T23:59:59");

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            completedAt: {
                gte: start,
                lte: end,
            },
        },
        select: {
            id: true,
            title: true,
        },
        orderBy: {
            completedAt: "asc",
        },
    });

    return tasks;
}

export async function getCompletedTaskDatesByMonth(userId: string, year: number, month: number) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            completedAt: {
                gte: firstDay,
                lte: lastDay,
            },
        },
        select: {
            completedAt: true,
        },
    });

    return tasks
            .map((t) => t.completedAt?.toISOString().split("T")[0])
            .filter(Boolean) as string[];
}

export async function getScheduledTaskDatesByMonth(userId: string, year: number, month: number) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0, 23, 59, 59);

    const tasks = await prisma.task.findMany({
        where: {
            userId,
            scheduledFor: {
                gte: firstDay,
                lte: lastDay,
            },
        },
        select: {
            scheduledFor: true,
        },
    });

    return tasks
            .map((t) => t.scheduledFor?.toISOString().split("T")[0])
            .filter(Boolean) as string[];
}