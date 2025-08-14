"use client";

import { deleteTask } from "@/app/agenda/actions/deleteTask";
import { TaskStatusForm } from "./TaskStatusForm";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface TaskProps {
    task: {
        id: string;
        title: string;
        description?: string | null;
        createdAt: Date;
        scheduledFor: Date;
        completedAt?: Date | null;
        status: "pending" | "in_progress" | "done";
        priorityColor: string;
    };
}

export function TaskCard({ task }: TaskProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const isDone = task.status === "done";

    const handleDelete = () => {
        setError(null);
        const formData = new FormData();
        formData.set("taskId", task.id);

        startTransition(async () => {
            const result = await deleteTask(formData);
            if ("error" in result) {
                setError(typeof result.error === "string"
                            ? result.error
                            : "Erro ao excluir tarefa");
            }
            else router.refresh();
        })
    }

    return (
        <li
            className={`p-4 rounded-lg shadow-sm border bg-[var(--card)]
                dark:bg-[var(--card)] transition-colors`}
        >
            <div className="flex justify-between items-center mb-2">
                <h2
                    className={`text-lg font-semibold
                        ${isDone
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-800 dark:text-gray-100"}`}
                >
                    {task.title}
                </h2>
                <div className="flex items-center gap-2">
                    <TaskStatusForm taskId={task.id} taskStatus={task.status} />
                    <span
                        className={`block w-3 h-3 rounded-full ${
                            isDone
                                ? "bg-gray-400"
                                : task.priorityColor === "red"
                                ? "bg-red-500"
                                : task.priorityColor === "yellow"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                        }`}
                    >
                        {/* {task.priorityColor} */}
                    </span>
                </div>
            </div>

            {task.description && (
                <p
                    className={`text-sm ${
                        isDone
                            ? "text-gray-500 line-through dark:text-gray-400"
                            : "text-gray-700 dark:text-gray-300"}`}
                >
                    {task.description}
                </p>
            )}

            <p className={`text-xs mt-2 ${isDone ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
                Criada em: {new Date(task.createdAt).toLocaleString("pt-BR")}
            </p>

            {task.completedAt ? (
                <p className={`text-xs text-gray-400`}>
                    Finalizada em: {new Date(task.completedAt).toLocaleString("pt-BR")}
                </p>
            ) : (
                <p className={`text-xs ${isDone ? "text-gray-400" : "text-gray-500 dark:text-gray-400"}`}>
                    Agendada para: {new Date(task.scheduledFor).toLocaleDateString("pt-BR")}
                </p>
            )}

            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            <div className="mt-4 flex items-center gap-4">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                    {isPending ? "Excluindo..." : "Excluir"}
                </button>

                {isDone ? (
                    <span className="text-sm text-gray-400 cursor-not-allowed">
                        Editar
                    </span>
                ) : (
                    <Link
                        href={`/agenda/edit/${task.id}`}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Editar
                    </Link>
                )}

                <Link
                    href={`/agenda/view/${task.id}`}
                    className="text-sm text-blue-600 hover:underline"
                >
                    Ver detalhes
                </Link>
            </div>
        </li>
    );
}