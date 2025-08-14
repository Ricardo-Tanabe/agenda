import { Task } from "@/generated/prisma";

type Params = {
    tasks: Task[],
    query: string,
    limit: number,
    page: number
}

export function getFilteredTasks({ tasks, query, limit, page }: Params) {
    const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description?.toLowerCase().includes(query.toLowerCase())
    );

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
        tasks: paginated,
        totalPages,
    }
}