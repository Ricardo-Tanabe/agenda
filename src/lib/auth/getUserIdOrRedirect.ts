import { redirect } from "next/navigation";
import { getUserIdOrThrow } from "@/lib/auth/getUserIdOrThrow";

export async function getUserIdOrRedirect(redirectTo: string = "/login"): Promise<string> {
    try {
        return await getUserIdOrThrow();
    } catch (error) {
        console.error("Erro de autenticação:", error);
        redirect(redirectTo);
    }
}