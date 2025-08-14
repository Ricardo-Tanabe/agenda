import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const { name, email, password } = (await req.json()) as RegisterBody;
    
        if (!name || name.trim().length < 2) {
            return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
        }
    
        if (!email || !EMAIL_REGEX.test(email)) {
            return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
        }
    
        if (!password || password.length < 6) {
            return NextResponse.json(
                { error: "A senha deve ter no mínimo 6 caracteres." },
                { status: 400 }
            )
        }
    
        const existing = await prisma.user.findUnique({ where: { email } });
    
        if (existing) {
            return NextResponse.json(
                { error: "Email já cadastrado." },
                { status: 400 }
            );
        }
    
        const hashed = await hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
            },
        });
    
        return NextResponse.json({ id: user.id, email: user.email });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);

        return NextResponse.json(
            { error: "Erro interno. Tente novamente mais tarde." },
            { status: 500 }
        );
    }
}