'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { isToday, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Props {
    baseDate: string;
    completedDates: string[];
    scheduledDates: string[];
    days: string[];
    prevMonthStr: string;
    nextMonthStr: string;
    titleStr: string;
}

export default function CalendarioClient({ baseDate, completedDates, scheduledDates, days, prevMonthStr, nextMonthStr, titleStr }: Props) {
    const router = useRouter();
    const [dayTasks, setDayTasks] = useState<{ id: string; title: string }[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number>(parseISO(baseDate).getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<string>(parseISO(baseDate).getFullYear().toString());
    const completedSet = new Set(completedDates.map(d => d.split("T")[0]));
    const scheduledSet = new Set(scheduledDates.map(d => d.split("T")[0]));

    function handleMonthYearChange(month: number, year: string) {
        const formatted = `${year}-${month.toString().padStart(2, "0")}`;
        router.push(`/agenda/calendario?month=${formatted}`);
    }

    useEffect(() => {
        const parsed = parseISO(baseDate);
        setSelectedMonth(parsed.getMonth() + 1);
        setSelectedYear(parsed.getFullYear().toString());
    }, [baseDate]);

    return (
        <section className="main-container">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <Link href={`/agenda/calendario?month=${prevMonthStr}`} className="text-blue-500 hover:underline">
                    ← Mês anterior
                </Link>

                <div className="flex items-center gap-2">
                    <select value={selectedMonth}
                        onChange={(e) => {
                            const newMonth = parseInt(e.target.value);
                            setSelectedMonth(newMonth);
                            handleMonthYearChange(newMonth, selectedYear);
                        }}
                        className="input-base appearance-none h-10 w-auto max-w-[10rem] text-left pr-8"
                        style={{
                            backgroundImage: `url("data:image/svg+xml;utf8,
                            <svg fill='${encodeURIComponent('var(--foreground)' )}' height='24'
                            viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 0.5rem center',
                            backgroundSize: '1em' }}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                                {format(new Date(2000, m - 1, 1), "MMMM", { locale: ptBR }).replace(/^./, (c) => c.toUpperCase())}
                            </option>
                        ))}
                    </select>

                    <input type="number" value={selectedYear}
                        onChange={(e) => {
                            const newYear = e.target.value;
                            setSelectedYear(newYear);

                            const yearNum = parseInt(newYear);
                            if (!isNaN(yearNum) && newYear.length === 4) {
                                setSelectedYear(newYear);
                                handleMonthYearChange(selectedMonth, newYear);
                            }
                        }}
                        className="input-base h-10 w-20"
                     />
                </div>
                <Link href={`/agenda/calendario?month=${nextMonthStr}`} className="text-blue-500 hover:underline">
                    Próximo mês →
                </Link>
            </div>

            <div className="grid grid-cols-7 text-sm text-center font-semibold mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
                {Array(parseISO(baseDate).getDay()).fill(null).map((_, idx) => (
                    <div key={`empty-${idx}`} />
                ))}

                {days.map((dateStr) => {
                    const day = parseISO(dateStr);
                    const dayKey = dateStr.split("T")[0];
                    const isCompleted = completedSet.has(dayKey);
                    const isScheduled = scheduledSet.has(dayKey);
                    const isCurrent = isToday(day);

                    const isFuture = day > new Date();

                    let bgColor = "bg-transparent";

                    if (isCompleted) bgColor = "bg-green-200 dark:bg-green-800";
                    else if (isScheduled) bgColor = isFuture ? "bg-yellow-200 dark:bg-yellow-800" : "bg-orange-200 dark:bg-orange-700";

                    const tooltip = isCompleted
                        ? `${day.getDate().toString().padStart(2, "0")}/${(day.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")} - Tarefas concluídas`
                        : isScheduled
                        ? `${day.getDate().toString().padStart(2, "0")}/${(day.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")} - Tarefas agendadas`
                        : "";

                    return (
                        <button
                            key={dateStr}
                            onClick={async () => {
                                setSelectedDate(dateStr);
                                const res = await fetch(`/api/tasks/completed/${dayKey}`);
                                const data = await res.json();
                                setDayTasks(data);
                            }}
                            title={tooltip}
                            className={`p-2 rounded-md border transition w-full
                                ${bgColor}
                                ${isCurrent ? "border-blue-500 font-bold" : "border-transparent"}
                                hover:bg-blue-100 dark:hover:bg-blue-900`}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>

            <Dialog open={!!selectedDate} onClose={() => setSelectedDate(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md w-full">
                        <DialogTitle className="text-lg font-semibold mb-2">
                            Tarefas de {selectedDate ? format(parseISO(selectedDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ""}
                        </DialogTitle>
                        {dayTasks.length > 0 ? (
                            <ul className="list-disc pl-5 text-sm text-gray-800 dark:text-gray-200 mb-4">
                                {dayTasks.map((task) => (
                                    <li key={task.id}>
                                        {task.title}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <>
                            {selectedDate && isToday(parseISO(selectedDate)) ? (
                                <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 italic">
                                    Acesse a agenda do dia.
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Nenhuma tarefa encontrada para este dia.
                                </p>
                            )}
                            </>
                        )}
                        <div className="mt-4 flex justify-between items-center text-sm">
                            <Link href={`/agenda/${selectedDate ? selectedDate.split("T")[0] : selectedDate}`}
                                className="text-blue-600 hover:underline"
                            >
                                Tarefas do dia
                            </Link>
                            <button onClick={() => setSelectedDate(null)} className="text-sm text-blue-600 hover:underline">
                                Fechar
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            <div className="mt-6 text-sm text-gray-700 dark:text-gray-300">
                <p>📅 Dias com tarefas: {completedDates.length}</p>
                <Link
                    href={`/agenda/calendario/anual?year=${selectedYear}`}
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                    📆 Calendário anual
                </Link>
            </div>
        </section>
    );
}