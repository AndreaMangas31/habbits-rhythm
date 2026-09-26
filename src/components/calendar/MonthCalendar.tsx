"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfToday,
  startOfWeek,
  endOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { toDayKey } from "@/lib/utils/habit-stats";
import { cn } from "@/lib/utils/cn";
import type { HabitCheckIn } from "@/types/habit";

type MonthCalendarProps = {
  checkIns: HabitCheckIn[];
  className?: string;
};

export function MonthCalendar({ checkIns, className }: MonthCalendarProps) {
  const [month, setMonth] = useState(startOfMonth(startOfToday()));
  const today = startOfToday();

  const completedDates = useMemo(() => {
    return new Set(
      checkIns
        .filter((item) => item.status === "completed")
        .map((item) => item.date),
    );
  }, [checkIns]);

  const missedDates = useMemo(() => {
    return new Set(
      checkIns
        .filter((item) => item.status === "missed" || item.status === "skipped")
        .map((item) => item.date),
    );
  }, [checkIns]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold capitalize text-foreground">
          {format(month, "MMMM yyyy", { locale: es })}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Mes anterior"
            className="rounded-lg p-1.5 text-muted hover:bg-surface-hover hover:text-foreground"
            onClick={() => setMonth((prev) => subMonths(prev, 1))}
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Mes siguiente"
            className="rounded-lg p-1.5 text-muted hover:bg-surface-hover hover:text-foreground"
            onClick={() => setMonth((prev) => addMonths(prev, 1))}
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
        {weekDays.map((day) => (
          <span key={day} className="py-1 font-medium">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toDayKey(day);
          const inMonth = isSameMonth(day, month);
          const isFuture = isAfter(day, today);
          const isToday = isSameDay(day, today);
          const completed = completedDates.has(key);
          const missed = missedDates.has(key);

          return (
            <div
              key={key}
              className={cn(
                "flex aspect-square items-center justify-center rounded-full text-xs font-medium",
                !inMonth && "opacity-30",
                isFuture && "text-muted/50",
                !isFuture && completed && "bg-success text-white",
                !isFuture && !completed && missed && "bg-muted/25 text-muted",
                !isFuture && !completed && !missed && "text-foreground",
                isToday && !completed && "ring-2 ring-primary/40",
              )}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
}
