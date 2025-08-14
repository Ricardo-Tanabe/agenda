import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getTaskWithNoteById } from "@/lib/data/getTasks";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import TaskNotes from "../components/TaskNotes";

interface PageProps {
    params: { id: string };
}

export default async function ViewTaskPage({ params }: PageProps) {
    const userId = await getUserIdOrRedirect();
    const awaitParams = await params;
    const task = await getTaskWithNoteById(awaitParams.id);

    if (!task || task.userId !== userId) redirect("/agenda");

    const formattedDate = format(new Date(task.scheduledFor), "dd/MM/yyyy", {
        locale: ptBR,
    });

    const taskDatePath = format(new Date(task.scheduledFor), "yyyy-MM-dd");

    return (
        <main className="agenda-bg min-h-screen py-10 px-4">
            <div className="main-container space-y-6">
                <h1 className="text-3xl font-bold handwritten">{task.title}</h1>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Programada para: <strong>{formattedDate}</strong></p>
                    <p>Status: <span className="capitalize">{task.status}</span></p>
                    <p>Prioridade: <span className="capitalize">{task.priorityColor}</span></p>
                </div>

                {task.description && (
                    <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {task.description}
                    </p>
                )}

                <TaskNotes notes={task.notes} taskId={task.id} />

                <div className="flex gap-2 flex-wrap">
                    <Link
                        href={`/agenda/edit/${task.id}`}
                        className="btn-primary"
                    >
                        Editar
                    </Link>
                    <Link
                        href={`/agenda/${taskDatePath}`}
                        className="btn-secondary"
                    >
                        Voltar
                    </Link>
                </div>
            </div>
        </main>
    );
}