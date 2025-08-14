import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getTaskById } from "@/lib/data/getTasks";
import { redirect } from "next/navigation";
import { EditTaskForm } from "@/app/agenda/components/EditTaskForm";
import { format } from "date-fns";
import { DATE_FORMAT_DAY } from "@/constants/dates";

interface PageProps {
    params: { id: string };
}

export default async function EditTaskPage({ params }: PageProps) {
    const userId = await getUserIdOrRedirect();

    const awaitParams = await params; // Manter por segurança
    const task = await getTaskById(awaitParams.id);

    if (!task || task.userId !== userId) {
        redirect(`/agenda/${format(new Date(), DATE_FORMAT_DAY)}`);
    }

    return (
        <main className="main-container">
            <h1 className="text-2xl font-bold mb-6">Editar Tarefa</h1>
            <EditTaskForm task={task} />
        </main>
    )
}