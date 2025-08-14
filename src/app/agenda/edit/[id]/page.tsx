import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getTaskById } from "@/lib/data/getTasks";
import { redirect } from "next/navigation";
import { EditTaskForm } from "@/app/agenda/components/EditTaskForm";

interface PageProps {
    params: { id: string };
}

export default async function EditTaskPage({ params }: PageProps) {
    const userId = await getUserIdOrRedirect();

    const awaitParams = await params; // Manter por segurança
    const task = await getTaskById(awaitParams.id);

    if (!task || task.userId !== userId) {
        redirect("/agenda");
    }

    return (
        <main className="main-container">
            <h1 className="text-2xl font-bold mb-6">Editar Tarefa</h1>
            <EditTaskForm task={task} />
        </main>
    )
}