import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getTasksByUserId } from "@/lib/data/getTasks";
import { TaskCard } from "@/app/agenda/components/TaskCard";
import { PaginationControls } from "../components/PaginationControls";
import { getFilteredTasks } from "./utils/getFilteredTasks";
import { FilterForm } from "./components/FilterForm";
import Link from "next/link";
import { format } from "date-fns";

type PageProps = {
    searchParams?: {
        query?: string,
        page?: string,
        limit?: string,
        completedFrom: string,
        completedTo: string,
        priority: string,
        sort: "asc" | "desc"
    }
}

export default async function AgendaPage({ searchParams }: PageProps) {
    const userId = await getUserIdOrRedirect();
    const allTasks = await getTasksByUserId(userId);

    const sParams = await searchParams
    const query = sParams?.query ?? "";
    const page = parseInt(sParams?.page || "1");
    const limit = parseInt(sParams?.limit || "10");
    const completedFrom = sParams?.completedFrom ?? "";
    const completedTo = sParams?.completedTo ?? "";
    const priority = sParams?.priority ?? "";
    const sort = sParams?.sort ?? "desc";

    const { tasks, totalPages } = getFilteredTasks({
        tasks: allTasks,
        query,
        limit,
        page,
        completedFrom,
        completedTo,
        priority,
        sort: sort === "asc" ? "asc" : "desc"
    })

    return (
        <main className="main-container agenda-bg">
            <h1 className="text-2xl font-bold mb-6 handwritten">Histórico de Tarefas</h1>

            <div className="mb-6 text-sm">
                <p>
                    Visualize o mês atual no{" "}
                    <Link
                        href={`/agenda/calendario?month=${format(new Date(), "yyyy-MM")}`}
                        className="text-blue-600 dark:text-blue-400 underline"
                    >
                        📅 Calendário mensal
                    </Link>{" "}
                    ou acesse o{" "}
                    <Link
                        href={`/agenda/calendario/anual?year=${new Date().getFullYear()}`}
                        className="text-blue-600 dark:text-blue-400 underline"
                    >
                        🗓️ Calendário anual
                    </Link>.
                </p>
            </div>

            <FilterForm values={{ query, limit, completedFrom, completedTo, priority, sort }} />

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Página {page} de {totalPages} - {tasks.length} tarefas exibidas
            </p>
            {tasks.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">Nenhuma tarefa finalizada ainda.</p>
            ) : (
                <ul className="space-y-4">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </ul>
            )}

            <PaginationControls currentPage={page} totalPages={totalPages} />
        </main>
    )
}