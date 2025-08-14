"use server";

import { prisma } from "@/lib/prisma";
import { getUserIdOrRedirect } from "../auth/getUserIdOrRedirect";

type CreateTaskInput = {
    title: string;
    description?: string;
    scheduledFor: string;
    priorityColor: "green" | "yellow" | "red";
}

export async function createTask(formData: FormData) {
    try {
        const userId = await getUserIdOrRedirect();
    
        const title = formData.get("title")?.toString().trim();
        const description = formData.get("description")?.toString().trim();
        const scheduledFor = formData.get("scheduledFor")?.toString();
        const priorityColor = formData.get("priorityColor")?.toString();
    
        if (!title || !scheduledFor || !priorityColor) {
            throw new Error("Campos obrigatórios não preenchidos.");
        }

        const color = priorityColor as CreateTaskInput["priorityColor"];
        if(!["green", "yellow", "red"].includes(color)) {
            throw new Error("Cor de prioridade inválida.");
        }

        const scheduledDate = new Date(scheduledFor);
        if (isNaN(scheduledDate.getTime())) {
            throw new Error("Data inválida")
        }
    
        await prisma.task.create({
            data: {
                userId,
                title,
                description: description || "",
                scheduledFor: scheduledDate,
                priorityColor: color,
                status: "pending",
            },
        });
    
        return { success: true };
    } catch (error) {
        console.error("Erro ao criar tarefa: ", error);
        return { error: "Erro ao criar tarefa. Tente novamente." };
    }
}