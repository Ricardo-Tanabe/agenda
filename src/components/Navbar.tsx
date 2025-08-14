"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
    Bars3Icon,
    XMarkIcon,
    PowerIcon,
    HomeIcon,
    CalendarDaysIcon,
    ClockIcon,
    ArchiveBoxIcon,
    ArrowRightStartOnRectangleIcon
} from "@heroicons/react/24/outline";

export function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [todayIso, setTodayIso] = useState<string>("");
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const getTodayIso = () => {
            const now = new Date();
            return now.toISOString().split("T")[0];
        }

        setTodayIso(getTodayIso());
    }, [])

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <nav className="w-full px-4 py-3 border-b border-gray-300 shadow-sm font-serif
        dark:border-gray-700 bg-[var(--card)] text-[var(--foreground)] z-50 relative">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
                <button className="sm:hidden" onClick={toggleMenu} aria-label="Abrir menu">
                    {menuOpen ? (
                        <XMarkIcon className="w-6 h-6" />
                    ) : (
                        <Bars3Icon className="w-6 h-6" />
                    )}
                </button>
                <div className="hidden sm:flex gap-6 items-center">
                    <Link href={"/"} className={`hover:underline ${isActive("/") ? "underline font-semibold text-blue-600 dark:text-blue-400" : ""}`}>Home</Link>
                    <Link href={`/agenda/dashboard`} className={`hover:underline ${isActive("/agenda/dashboard") ? "underline font-semibold text-blue-600 dark:text-blue-400" : ""}`}>Dashboard</Link>
                    <Link href={`/agenda/calendario`} className={`hover:underline ${isActive("/agenda/calendario") ? "underline font-semibold text-blue-600 dark:text-blue-400" : ""}`}>Calendário</Link>
                    <Link href={`/agenda/${todayIso}`} className={`hover:underline ${isActive(`/agenda/${todayIso}`) ? "underline font-semibold text-blue-600 dark:text-blue-400" : ""}`}>Agenda</Link>
                    <Link href={`/agenda/historico`} className={`hover:underline ${isActive("/agenda/historico") ? "underline font-semibold text-blue-600 dark:text-blue-400" : ""}`}>Histórico</Link>
                </div>

                <div className="flex items-center gap-4">
                    {!session ? (
                        <>
                        <Link href={'/login'}
                        className={`hover:underline flex items-center gap-1 ${isActive("/login") ? "font-semibold text-blue-600 dark:text-blue-400" : ""}`}>
                            <ArrowRightStartOnRectangleIcon className="w-5 h-5 sm:hidden text-blue-600" />
                            <span className="hidden sm:inline">
                                Login
                            </span>
                        </Link>
                        <Link href={'/register'}
                        className={`hover:underline flex items-center gap-1 ${isActive("/register") ? "font-semibold text-blue-600 dark:text-blue-400" : ""}`}>
                            Registrar
                        </Link>
                        </>
                    ) : (
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline"
                        >
                            <PowerIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    )}
                </div>
            </div>

            <div className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden
                ${menuOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
            `}>
                <div className="mt-2 flex flex-col gap-2 px-2 pt-2 pb-3 rounded-md shadow bg-[var(--card)]">
                    <Link href="/"
                    className={`flex items-center gap-1 hover:underline ${isActive("/") ? "font-semibold text-blue-600 dark:text-blue-400" : ""}`}>
                        <HomeIcon className="w-5 h-5" />
                        <span>Home</span>
                    </Link>
                    <Link href="/agenda/dashboard"
                    className={`flex items-center gap-1 hover:underline ${isActive("/agenda/dashboard") ? "font-semibold text-blue-600 dark:text-blue-400" : ""}`}>
                        <ClockIcon className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/agenda/calendario"
                    className={`flex items-center gap-1 hover:underline ${isActive("/agenda/calendario") ? "font-semibold text-blue-600 dark:text-blue-400" : ""}`}>
                        <CalendarDaysIcon className="w-5 h-5" />
                        <span>Calendário</span>
                    </Link>
                    <Link href={`/agenda/${todayIso}`}
                    className={`flex items-center gap-1 hover:underline ${isActive(`/agenda/${todayIso}`) ? "font-semibold text-blue-600 dark:text-blue-400" : ""}`}>
                        <ClockIcon className="w-5 h-5" />
                        <span>Agenda</span>
                    </Link>
                    <Link href="/agenda/historico"
                    className={`flex items-center gap-1 hover:underline ${isActive("/agenda/historico") ? "font-semibold text-blue-600 dark:text-blue-400" : ""}`}>
                        <ArchiveBoxIcon className="w-5 h-5" />
                        <span>Histórico</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}