"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { maxEmailLength, maxPasswordLength } from "@/constants/validation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (session?.user && !session.user.needsRefresh) {
            router.push("/agenda/dashboard");
        }
    }, [session, router]);

    const validate = () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("E-mail inválido.");
            return false;
        }

        if (!password || password.length < 6) {
            setError("A senha deve ter no mínimo 6 caracteres.")
            return false;
        }

        setError("");
        return true;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) setError("E-mail ou senha inválidos.");
        else router.push("/");
    }

    if (status === "loading") return null;

    return (
        <main className="flex justify-center items-center min-h-screen bg-background px-4">
            <form
                onSubmit={handleSubmit}
                className="auth-wrapper space-y-4"
            >
                <h1 className="auth-title">Entrar</h1>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div>
                    <label className="label-base" htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
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
                        type="password"
                        placeholder="••••••••"
                        className="input-base"
                        value={password}
                        maxLength={maxPasswordLength}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn-primary w-full">Entrar</button>

                <p className="text-sm text-center">
                    Não possui conta? 
                    <Link href={"/register"} className="auth-link">Cadastre-se aqui</Link>
                </p>
            </form>
        </main>
    );
}