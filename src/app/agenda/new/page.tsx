import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { NewTaskForm } from "@/app/agenda/components/NewTaskForm";

export default async function NewTaskPage() {
    await getUserIdOrRedirect();

    return (
        <main className="main-container">
            <h1 className="text-2xl font-bold mb-6">Nova Tarefa</h1>
            <NewTaskForm />
        </main>
    );
}