"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createTask } from "@/lib/actions/createTask";
import { maxTitleLength, maxDescriptionLength } from "@/constants/validation";

export function NewTaskForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await createTask(formData);
            if("error" in result) setError(result.error ?? "Erro desconhecido");
            else router.back();
        });
    }

    return (
        <form
            action={handleSubmit}
            className="space-y-5"
        >
            <div>
                <label htmlFor="title" className="label-base">
                    Título *
                </label>
                <input
                    id="title" name="title" type="text" required
                    maxLength={maxTitleLength} className="input-base"
                />
                <p className="hint-text">
                    Máximo de {maxTitleLength} caracteres
                </p>
            </div>

            <div>
                <label htmlFor="description" className="label-base">
                    Descrição
                </label>
                <textarea
                    id="description" name="description" rows={3}
                    maxLength={maxDescriptionLength} className="input-base"
                />
                <p className="hint-text">
                    Máximo de {maxDescriptionLength} caracteres.
                </p>
            </div>

            <div>
                <label htmlFor="scheduledFor" className="label-base">
                    Data e hora *
                </label>
                <input
                    id="scheduledFor" name="scheduledFor" type="datetime-local"
                    required className="input-base"
                />
            </div>

            <div>
                <label htmlFor="priorityColor" className="label-base">
                    Prioridade *
                </label>
                <select
                    id="priorityColor" name="priorityColor" required
                    className="input-base"
                >
                    <option value="red">Urgente</option>
                    <option value="yellow">Média</option>
                    <option value="green">Leve</option>
                </select>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-primary"
                >
                    {isPending ? "Criando..." : "Criar tarefa"}
                </button>

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn-secondary"
                >
                    Cancelar
                </button>
            </div>

        </form>
    );
}