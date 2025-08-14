import { NextResponse } from "next/server";
import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getCompletedTasksByDate } from "@/lib/data/getTasks";

export async function GET(req: Request, { params }: { params: { date: string } }) {
    const paramsAwait = await params;
    const userId = await getUserIdOrRedirect();
    const tasks = await getCompletedTasksByDate(userId, paramsAwait.date);

    return NextResponse.json(tasks);
}