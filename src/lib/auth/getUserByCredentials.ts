import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export async function getUserByCredentials(email: string, password: string) {
    try {
        if (!email || !password) return null;
    
        const user = await prisma.user.findUnique({ where: {email} });
        if (!user) return null;
    
        const isValid = await compare(password, user.password);
        return isValid ? user : null;
    } catch (error) {
        console.error("Erro em getUserByCredentials:", error);
        return null;
    }
}