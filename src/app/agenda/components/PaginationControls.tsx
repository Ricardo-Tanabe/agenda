"use client"

import { useRouter, useSearchParams } from "next/navigation"

type PaginationControlsProps = {
    currentPage: number,
    totalPages: number
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    }

    if (totalPages <= 1) return null;

    const MAX_VISIBLE_PAGES = 5;
    let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let endPage = startPage + MAX_VISIBLE_PAGES - 1

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1}, (_, i) => startPage + i)

    return (
        <div className="fixed bottom-0 left-0 w-full bg-card py-4
        dark:border-gray-600 shadow-md flex justify-center space-x-2 z-10">
            {currentPage > 1 && (
                <>
                <button
                    onClick={() => goToPage(1)}
                    className="btn-secondary px-2 py-1"
                    aria-label="Primeira página"
                >
                    «
                </button>
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="btn-secondary px-2 py-1"
                    aria-label="Página anterior"
                >
                    ‹
                </button>
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded transition ${
                        page === currentPage
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    aria-current={page === currentPage ? "page" : undefined}
                >
                    {page}
                </button>
            ))}
            
            {currentPage < totalPages && (
                <>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="btn-secondary px-2 py-1"
                    aria-label="Página posterior"
                >
                    ›
                </button>
                <button
                    onClick={() => goToPage(totalPages)}
                    className="btn-secondary px-2 py-1"
                    aria-label="Última página"
                >
                    »
                </button>
                </>
            )}
        </div>
    )
}