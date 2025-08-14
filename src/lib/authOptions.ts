import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserByCredentials } from "./auth/getUserByCredentials";
import { canAttemptLogin } from "./auth/loginRateLimit";
import type { JWT } from "next-auth/jwt";
import type { User , Session, RequestInternal } from "next-auth";

async function handleJWT({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
    const maxAge = 60 * 60 * 1000 // 1 hora em ms

    if (user) {
        token.id = user.id;
        token.createdAt = Date.now(); // Marca o tempo de criação
    } else if (typeof token.createdAt === "number") {
        const age = Date.now() - token.createdAt;
        if (age > maxAge) {
            token.needsRefresh = true;
        }
    };
    return token;
}

async function handleSession({ session, token }: { session: Session; token: JWT}): Promise<Session> {
    if (token?.id && session.user) session.user.id = token.id as string;
    return session;
}

async function authorize(
    credentials: Record<"email" | "password", string> | undefined,
    req: Pick<RequestInternal, "headers">
) {
    try {
        const ip = req?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

        if(!canAttemptLogin(ip)) {
            console.warn(`Login bloqueado temporariamente para o IP: ${ip}`);
            return null;
        }

        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByCredentials(credentials.email, credentials.password);

        return user
            ? { id: user.id, name: user.name, email: user.email }
            : null;
    } catch (error) {
        console.error("Erro no authorize:", error);
        return null;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize
        })
    ],
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 // Expira em 1 hora
    },
    jwt: {
        maxAge: 60 * 60 // Expira em 1 hora
    },
    callbacks: {
        jwt: handleJWT,
        session: handleSession,
    }
}