import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getTasksByUserId } from "@/lib/data/getTasks";
import Link from "next/link";

export default async function DashboardPage() {
    const userId = await getUserIdOrRedirect();
    const tasks = await getTasksByUserId(userId);

    const todayStr = new Date().toISOString().split("T")[0];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "done").length;
    const pendingTasks = totalTasks - completedTasks;

    return (
        <section className="p-6 max-w-3xl mx-auto rounded-xl shadow-sm font-serif
        bg-[#fdfaf6] text-[#222] dark:bg-[#1a1a1a] dark:text-[#f2f2f2]">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                <Link
                    href={"/agenda/new"}
                    className="inline-block bg-blue-600 hover:bg-blue-700
                    text-white font-semibold px-4 py-2 rounded transition"
                >
                    Nova Tarefa
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-lg">
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                        Total
                    </p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {totalTasks}
                    </p>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                        Pendentes
                    </p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {pendingTasks}
                    </p>
                </div>
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow">
                    <p className="font-semibold text-gray-600 dark:text-gray-300">
                        Concluídas
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                        {completedTasks}
                    </p>
                </div>
            </div>

            <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
                <p>Esses dados representam o resumo atual das suas tarefas.</p>
                <p>
                    Você pode visualizar todas as tarefas acessando {" "}
                    <Link href={`/agenda/${todayStr}`} className="text-blue-600 dark:text-blue-400 underline">
                        Minha Agenda
                    </Link>.
                </p>
                <p className="mt-2">
                    Ou veja o panorama anual em {" "}
                    <Link
                        href={`/agenda/calendario/anual?year=${new Date().getFullYear()}`}
                        className="text-blue-600 dark:text-blue-400 underline"
                    >
                        📆 Calendário anual
                    </Link>
                </p>
            </div>
        </section>
    )
}