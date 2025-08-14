import { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function getSessionOrThrow(): Promise<Session> {
    const session = await getServerSession(authOptions);  

    if(!session) throw new Error("Sessão não encontrada");
    
    return session;
}