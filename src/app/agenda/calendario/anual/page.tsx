import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getCompletedTaskDatesByMonth, getScheduledTaskDatesByMonth } from "@/lib/data/getTasks";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export default async function VisaoAnualPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const searchParamsAwait = await searchParams;
  
    const year = Number(searchParamsAwait.year || new Date().getFullYear());
    const userId = await getUserIdOrRedirect();

    const months = await Promise.all(
        Array.from({ length: 12 }, async (_, index) => {
            const completed = await getCompletedTaskDatesByMonth(userId, year, index + 1);
            const scheduled = await getScheduledTaskDatesByMonth(userId, year, index + 1);

            const days = eachDayOfInterval({
                start: startOfMonth(new Date(year, index)),
                end: endOfMonth(new Date(year, index)),
            });

            return {
                monthIndex: index,
                completed,
                scheduled,
                days,
            };
        })
    );

    return (
        <section className="main-container">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Visão Anual - {year}</h1>
                <Link href="/agenda/calendario" className="text-sm text-blue-600 hover:underline">
                    ← Calendário mensal
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {months.map(({ monthIndex, completed, scheduled, days }) => {
                const completedSet = new Set(completed);
                const scheduledSet = new Set(scheduled);

                return (
                    <div key={monthIndex} className="border rounded p-4 shadow-sm">
                    <h2 className="text-md font-semibold mb-2">
                        {format(new Date(year, monthIndex), "MMMM", { locale: ptBR })}
                    </h2>
                    <div className="grid grid-cols-7 gap-1 text-sm">
                        {days.map((day) => {
                            const dateStr = day.toISOString().split("T")[0];
                            const isCompleted = completedSet.has(dateStr);
                            const isScheduled = scheduledSet.has(dateStr);
                            const todayStr = new Date().toISOString().split("T")[0];
                            const isToday = dateStr === todayStr;
                            const isFuture = day > new Date();

                            let bgColor = "bg-transparent";
                            if (isCompleted) bgColor = "bg-green-200 dark:bg-green-800";
                            else if (isScheduled) bgColor = isFuture ? "bg-yellow-200 dark:bg-yellow-800" : "bg-orange-200 dark:bg-orange-700"
                            else if (isToday) bgColor = "bg-blue-200 dark:bg-blue-800";

                            return (
                                <Link
                                    key={dateStr}
                                    href={`/agenda/${dateStr}`}
                                    className={`block p-1 text-center rounded ${bgColor} hover:bg-blue-100 dark:hover:bg-blue-900`}
                                    title={`${format(day, "dd/MM/yyyy", { locale: ptBR })}${
                                        isCompleted
                                            ? " - Tarefas concluídas"
                                            : isScheduled
                                            ? " - Tarefas agendadas"
                                            :""
                                    }`}
                                >
                                    {day.getDate()}
                                </Link>
                            );
                        })}
                    </div>
                    </div>
                );
                })}
            </div>
        </section>
    );
}