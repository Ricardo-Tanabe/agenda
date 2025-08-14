"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { maxNameLength, maxEmailLength, maxPasswordLength } from "@/constants/validation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/agenda/dashboard");
        }
    }, [status, router]);

    const validate = () => {
        if (!name || name.trim().length < 2) {
            setError("O nome deve ter no mínimo 2 caracteres.");
            return false;
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("E-mail inválido.");
            return false;
        }

        if (!password || password.length < 6) {
            setError("A senha deve ter no mínimo 6 caracteres.");
            return false;
        }

        setError("");
        return true;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(!validate()) return;

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.trim(),
                email: email.toLowerCase(),
                password }),
        });

        if (res.ok) router.push("/login");
        else {
            const data = await res.json();
            setError(data.error || "Erro ao registrar");
        }
    }

    if (status === "loading") return null;

    return (
        <main className="flex justify-center items-center min-h-screen bg-background px-4">
            <form onSubmit={handleSubmit} className="auth-wrapper space-y-4">
                <h1 className="auth-title">Criar Conta</h1>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                    <label className="label-base" htmlFor="name">Nome</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nome"
                        className="input-base"
                        value={name}
                        maxLength={maxNameLength}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="label-base" htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="text"
                        placeholder="exemplo@email.com"
                        className="input-base"
                        value={email}
                        maxLength={maxEmailLength}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="label-base" htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="input-base"
                        value={password}
                        maxLength={maxPasswordLength}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>


                <button type="submit" className="btn-primary w-full">Registrar</button>
                <p className="text-sm text-center">
                    Já possui conta?
                    <Link href={"/login"} className="auth-link">Faça login</Link>
                </p>
            </form>
        </main>
    )
}