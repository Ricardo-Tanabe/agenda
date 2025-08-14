"use client"

import { useState } from "react";

type PageProps = {
    values: {
        query: string,
        limit: number,
        completedFrom: string,
        completedTo: string,
        priority: string,
        sort: "asc" | "desc"
    }
}

export function FilterForm({ values }: PageProps) {
    const [open, setOpen] = useState(false);

    const query = values.query;
    const limit = values.limit;
    const completedFrom = values.completedFrom;
    const completedTo = values.completedTo;
    const priority = values.priority;
    const sort = values.sort;

    return (
        <div className="mb-6">
            <button
                onClick={() => setOpen(!open)}
                className="btn-secondary w-full md:w-auto mb-4"
            >
                {open ? "Ocultar filtros" : "Mostrar filtros"}
            </button>

        {open && (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-1 col-span-full md:col-span-2">
                    <label htmlFor="query" className="font-medium text-sm">Buscar</label>
                    <input
                        id="query"
                        type="text"
                        name="query"
                        placeholder="Buscar por título ou descrição..."
                        defaultValue={query}
                        className="input-base h-10"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="completedFrom" className="font-medium text-sm">De</label>
                    <input
                        id="completedFrom"
                        type="date"
                        name="completedFrom"
                        defaultValue={completedFrom}
                        className="input-base h-10"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="completedTo" className="font-medium text-sm">Até</label>
                    <input
                        id="completedTo"
                        type="date"
                        name="completedTo"
                        defaultValue={completedTo}
                        className="input-base h-10"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="priority" className="font-medium text-sm">Prioridade</label>
                    <select
                        id="priority"
                        name="priority"
                        defaultValue={priority}
                        className="input-base h-10"
                    >
                        <option value="">Todas as prioridades</option>
                        <option value="green">Leve</option>
                        <option value="yellow">Média</option>
                        <option value="red">Urgente</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="sort" className="font-medium text-sm">Ordenar</label>
                    <select
                        id="sort"
                        name="sort"
                        defaultValue={sort}
                        className="input-base h-10"
                    >
                        <option value="desc">Mais recentes primeiro</option>
                        <option value="asc">Mais antigas primeiro</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="limit" className="font-medium text-sm">Itens por página</label>
                    <select
                        id="limit"
                        name="limit"
                        defaultValue={limit}
                        className="input-base h-10"
                    >
                        {[10, 20, 30, 40, 50].map((n) => (
                            <option key={n} value={n}>
                                {n} por página
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <button type="submit" className="btn-primary h-10 w-full md:w-auto">Filtrar</button>
                </div>
            </form>
        )}
        </div>
    );
}