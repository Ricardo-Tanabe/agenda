import { redirect } from "next/navigation";
import { parseISO, format, isValid, startOfDay, endOfDay, isSameDay } from "date-fns";
import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getTasksByUserId } from "@/lib/data/getTasks";
import { postponeOldTasks } from "@/lib/actions/postponeTasks";
import { getFilteredTasks } from "@/app/agenda/[date]/utils/getFilteredTasks";
import { TaskCard } from "@/app/agenda/components/TaskCard";
import { PaginationControls } from "@/app/agenda/components/PaginationControls";
import Link from "next/link";

import { DAY_IN_MS, DATE_FORMAT_DAY, DATE_FORMAT_DISPLAY, DATE_FORMAT_MONTH } from "@/constants/dates";
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_NUMBER } from "@/constants/pagination";
import { ROUTE_DASHBOARD, ROUTE_NEW_TASK, ROUTE_CALENDAR_MONTH, ROUTE_CALENDAR_YEAR } from "@/constants/routes";

type PageProps = {
    params: {date: string};
    searchParams?: { query?: string, page?: string, limit?: string}
};

export default async function AgendaByDatePage({ params, searchParams }: PageProps) {
    const userId = await getUserIdOrRedirect();

    const awaitParams = await params; // Manter por segurança
    if (!awaitParams?.date || typeof awaitParams.date !== "string") redirect(ROUTE_DASHBOARD);
    const date = parseISO(awaitParams.date);
    if (!isValid(date)) redirect(ROUTE_DASHBOARD);

    const today = startOfDay(new Date());
    const isToday = isSameDay(date, today);

    if (isToday) await postponeOldTasks(userId, today);

    const start = startOfDay(date);
    const end = endOfDay(date);

    const allTasks = await getTasksByUserId(userId, {
        from: start.toISOString(),
        to: end.toISOString(),
    });

    const awaitSearchParams = await searchParams; // Manter por segurança
    
    const query = awaitSearchParams?.query ?? "";
    const page = parseInt(awaitSearchParams?.page || String(DEFAULT_PAGE_NUMBER));
    const limit = parseInt(awaitSearchParams?.limit || String(DEFAULT_PAGE_SIZE));

    const { tasks, totalPages } = getFilteredTasks({
        tasks: allTasks,
        query,
        page,
        limit
    });

    return (
        <main className="main-container agenda-bg">
            <h1 className="text-2xl font-bold mb-6 handwritten">
                Tarefas do dia {format(date, DATE_FORMAT_DISPLAY)}
            </h1>

            <form className="flex flex-col md:flex-row items-center gap-4 mb-6">
                <input
                    type="text"
                    name="query"
                    placeholder="Buscar por título ou descrição..."
                    defaultValue={query}
                    className="input-base w-full h-10 md:w-[300px]"
                />
                <select
                    name="limit"
                    defaultValue={limit}
                    className="input-base w-full h-10 md:w-[140px]"
                >
                    {PAGE_SIZE_OPTIONS.map(n => (
                        <option key={n} value={n}>{n} por página</option>
                    ))}
                </select>
                <button type="submit" className="btn-primary h-10 w-full md:w-auto">Filtrar</button>
            </form>

            <div className="flex gap-4 mb-6">
                <Link href={ROUTE_NEW_TASK} className="btn-primary">
                    Nova Tarefa
                </Link>
                <Link
                    href={`/agenda/${format(new Date(date.getTime() - DAY_IN_MS), DATE_FORMAT_DAY)}`}
                    className="btn-secondary"
                >
                    Dia Anterior
                </Link>
                <Link
                    href={`/agenda/${format(new Date(date.getTime() + DAY_IN_MS), DATE_FORMAT_DAY)}`}
                    className="btn-secondary"
                >
                    Próximo Dia
                </Link>
            </div>

            <div className="mb-6 text-sm">
                <p>
                    Visualize o mês atual no{" "}
                    <Link
                        href={`${ROUTE_CALENDAR_MONTH}?month=${format(date, DATE_FORMAT_MONTH)}`}
                        className="text-blue-600 dark:text-blue-400 underline"
                    >
                        📅 Calendário mensal
                    </Link>{" "}
                    ou acesse o{" "}
                    <Link
                        href={`${ROUTE_CALENDAR_YEAR}?year=${date.getFullYear()}`}
                        className="text-blue-600 dark:text-blue-400 underline"
                    >
                        🗓️ Calendário anual
                    </Link>
                </p>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Página {page} de {totalPages} - {tasks.length} tarefas exibidas
            </p>

            {tasks.length === 0 ? (
                <p className="text-gray-600">Nenhuma tarefa para esse dia.</p>
            ) : (
                <ul className="space-y-4">
                    {tasks.map((task) => ( // verificar
                        <TaskCard key={task.id} task={task} />
                    ))}
                </ul>
            )}

            <PaginationControls currentPage={page} totalPages={totalPages} />
        </main>
    )
}