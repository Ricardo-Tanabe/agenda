import { getUserIdOrRedirect } from "@/lib/auth/getUserIdOrRedirect";
import { getCompletedTaskDatesByMonth, getScheduledTaskDatesByMonth } from "@/lib/data/getTasks";
import { startOfMonth, endOfMonth, addMonths, subMonths, eachDayOfInterval, parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CalendarioClient from "./components/CalendarioClient";

import { DATE_FORMAT_MONTH, DATE_FORMAT_MONTH_YEAR } from "@/constants/dates";

export default async function CalendarioPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const searchParamsAwait = await searchParams;
    const raw = searchParamsAwait.month;
    const baseDate = raw ? parseISO(`${raw}-01`) : new Date();
    const currentYear = baseDate.getFullYear();
    const currentMonth = baseDate.getMonth() + 1;

    const userId = await getUserIdOrRedirect();
    const completedDates = await getCompletedTaskDatesByMonth(userId, currentYear, currentMonth);
    const scheduledDates = await getScheduledTaskDatesByMonth(userId, currentYear, currentMonth);

    const monthStart = startOfMonth(baseDate);
    const monthEnd = endOfMonth(baseDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const prevMonth = subMonths(baseDate, 1);
    const nextMonth = addMonths(baseDate, 1);

    return (
        <CalendarioClient
            baseDate={baseDate.toISOString()}
            completedDates={completedDates}
            scheduledDates={scheduledDates}
            days={days.map((d) => d.toISOString())}
            prevMonthStr={format(prevMonth, DATE_FORMAT_MONTH)}
            nextMonthStr={format(nextMonth, DATE_FORMAT_MONTH)}
            titleStr={format(baseDate, DATE_FORMAT_MONTH_YEAR, { locale: ptBR })}
        />
    );
}