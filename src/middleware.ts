import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

const protectedRoutes = ["/agenda"];

export async function middleware(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET;
    if(!secret) throw new Error("NEXTAUTH_SECRET não definido.");

    const token = await getToken({ req, secret }) as JWT | null;
    
    const isProtected = protectedRoutes.some((path) =>
        req.nextUrl.pathname === path ||
        req.nextUrl.pathname.startsWith(path)
    );

    if (isProtected) {
        const loginUrl = new URL("/login", req.url);
        if(!token) {
            return NextResponse.redirect(loginUrl);
        }
        if(token.needsRefresh) {
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/agenda/:path*"
    ]
}