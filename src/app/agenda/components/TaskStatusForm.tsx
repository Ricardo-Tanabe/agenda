'use client'

import { updateTaskStatus } from "@/app/agenda/actions/updateStatus";
import { useState, useTransition } from 'react'

interface TaskStatusFormProps {
    taskId: string;
    taskStatus: "pending" | "in_progress" | "done";
}

export function TaskStatusForm({ taskId, taskStatus }: TaskStatusFormProps) {
    const [value, setValue] = useState(taskStatus);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as "pending" | "in_progress" | "done";
        if (newStatus === value) return;

        setValue(newStatus);
        setError(null);

        const formData = new FormData();
        formData.append("taskId", taskId);
        formData.append("status", newStatus);

        startTransition(() => {
            const result = updateTaskStatus(formData)
            if ("error" in result) {
                setError(typeof result.error === "string"
                            ? result.error
                            : "Erro desconhecido");
                setValue(taskStatus);
            }
        });
    }

    return (
        <div className="flex flex-col items-start">
            <select
                name="status"
                value={value}
                onChange={handleChange}
                disabled={isPending}
                className={`
                    text-sm px-2 py-1 rounded-md border shadow-sm
                    bg-[var(--form-bg)] text-[var(--input-text)]
                    border-[var(--input-border)]
                    focus:ring-2 focus:ring-blue-500 focus:outline-none
                    disabled:opacity-50
                `}
            >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Progresso</option>
                <option value="done">Concluído</option>
            </select>
            {error && (<p className="text-xs text-red-600 mt-1">{error}</p>)}
        </div>
    );
}