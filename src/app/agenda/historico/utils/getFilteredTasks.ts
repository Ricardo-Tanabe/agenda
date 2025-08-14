import { Task } from "@/generated/prisma";

interface GetFilteredTasksParams {
    tasks: Task[];
    query: string;
    limit: number;
    page: number;
    completedFrom: string;
    completedTo: string;
    priority: string;
    sort: "asc" | "desc";
}

export function getFilteredTasks({
    tasks, query, limit, page, completedFrom, completedTo, priority, sort
} : GetFilteredTasksParams) {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
        const isDone = task.status === "done";
        const matchesQuery =
            task.title.toLowerCase().includes(normalizedQuery) ||
            task.description?.toLowerCase().includes(normalizedQuery);
        
        const matchesPriority = priority ? task.priorityColor === priority : true;

        const matchesDateFrom = completedFrom
            ? task.completedAt && task.completedAt >= new Date(completedFrom)
            : true;

        const matchesDateTo = completedTo
            ? task.completedAt && task.completedAt <= new Date(completedTo + "T23:59:59")
            : true;

        return isDone && matchesQuery && matchesPriority && matchesDateFrom && matchesDateTo;
    }).sort((a, b) => {
        const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return sort === "asc" ? dateA - dateB : dateB - dateA;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        tasks: filtered.slice(start, end),
        total,
        totalPages
    }
}