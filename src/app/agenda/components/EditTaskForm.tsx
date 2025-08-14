"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateTask } from "@/lib/actions/updateTask";
import { maxTitleLength, maxDescriptionLength } from "@/constants/validation";
import { format } from "date-fns";

interface Task {
    id: string;
    title: string;
    description?: string | null;
    scheduledFor: Date;
    priorityColor: string;
}

function formatLocalDateTime(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EditTaskForm({ task }: { task: Task }) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await updateTask(formData);
            if("error" in result) setError(result.error ?? "Erro desconhecido");
            else router.push("/agenda/" + taskDatePath);
        })
    }

    const taskDatePath = format(new Date(task.scheduledFor), "yyyy-MM-dd");

    return (
        <form
            action={handleSubmit}
            className="space-y-5"
        >
            <input type="hidden" name="id" value={task.id} />

            <div>
                <label htmlFor="title" className="label-base">Título *</label>
                <input
                    id="title" name="title" defaultValue={task.title} type="text"
                    required maxLength={maxTitleLength} className="input-base"
                />
                <p className="hint-text">Máximo de {maxTitleLength} caracteres.</p>
            </div>

            <div>
                <label htmlFor="description" className="label-base">Descrição</label>
                <textarea
                    id="description" name="description" defaultValue={task.description ?? ""}
                    maxLength={maxDescriptionLength} className="input-base"
                />
                <p className="hint-text">Máximo de {maxDescriptionLength} caracteres.</p>
            </div>

            <div>
                <label htmlFor="scheduledFor" className="label-base">Data e hora *</label>
                <input
                    id="scheduledFor" name="scheduledFor" type="datetime-local"
                    defaultValue={formatLocalDateTime(task.scheduledFor)}
                    required className="input-base"
                />
            </div>

            <div>
                <label htmlFor="priorityColor" className="label-base">Prioridade *</label>
                <select
                    id="priorityColor" name="priorityColor" defaultValue={task.priorityColor ?? "green"}
                    required className="input-base"
                >
                    <option value="red">Urgente</option>
                    <option value="yellow">Média</option>
                    <option value="green">Leve</option>
                </select>
            </div>

            {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary"
                >
                    {isPending ? "Atualizando..." : "Atualizar tarefa"}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/agenda/" + taskDatePath)}
                    className="btn-secondary"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}