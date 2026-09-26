"use client";

import { useEffect, useState } from "react";
import { Card, Skeleton } from "@/components/ui";
import { MonthCalendar } from "@/components/calendar";
import { getCheckIns, getHabits } from "@/lib/api/habits";
import type { Habit, HabitCheckIn } from "@/types/habit";
import { getHabitIcon } from "@/lib/icons/habit-icons";
import { HABIT_COLOR_STYLES } from "@/components/onboarding/color-map";
import { cn } from "@/lib/utils/cn";

export default function CalendarPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkIns, setCheckIns] = useState<HabitCheckIn[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const [nextHabits, nextCheckIns] = await Promise.all([
        getHabits(),
        getCheckIns(),
      ]);
      setHabits(nextHabits);
      setCheckIns(nextCheckIns);
      setSelectedId(nextHabits[0]?.id ?? null);
      setLoading(false);
    })();
  }, []);

  const filtered = selectedId
    ? checkIns.filter((item) => item.habitId === selectedId)
    : checkIns;

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-semibold">Calendario</h2>
        <p className="text-sm text-muted">
          Vista mensual de completados por hábito.
        </p>
      </div>

      {loading ? (
        <Skeleton className="h-80 rounded-3xl" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
          <Card padding="md" className="space-y-2 border border-foreground/5">
            {habits.map((habit) => {
              const Icon = getHabitIcon(habit.icon);
              const color = HABIT_COLOR_STYLES[habit.color];
              const active = selectedId === habit.id;

              return (
                <button
                  key={habit.id}
                  type="button"
                  onClick={() => setSelectedId(habit.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm",
                    active ? "bg-primary/10 text-primary" : "hover:bg-surface-hover",
                  )}
                >
                  <Icon className={cn("h-4 w-4", color.icon)} />
                  {habit.name}
                </button>
              );
            })}
          </Card>

          <Card padding="lg" className="border border-foreground/5 shadow-card">
            <MonthCalendar checkIns={filtered} />
          </Card>
        </div>
      )}
    </div>
  );
}
