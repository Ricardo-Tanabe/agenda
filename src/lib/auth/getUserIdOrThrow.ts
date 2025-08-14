"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getUserIdOrThrow(): Promise<string> {
    const session = await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (!userId) throw Error("Usuário não autenticado ou sessão inválida.");

    return userId;
}