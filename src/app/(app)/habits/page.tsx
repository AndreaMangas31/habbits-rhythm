"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { HabitCard } from "@/components/habit";
import { Card, Skeleton } from "@/components/ui";
import { getHabits, getCheckIns, toggleHabitCheckIn } from "@/lib/api/habits";
import { calculateStreaks } from "@/lib/utils/date";
import { isCompletedOnDate } from "@/lib/utils/habit-stats";
import type { Habit } from "@/types/habit";

type HabitListItem = {
  habit: Habit;
  streak: number;
  completedToday: boolean;
};

export default function HabitsPage() {
  const [items, setItems] = useState<HabitListItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [habits, checkIns] = await Promise.all([getHabits(), getCheckIns()]);
    const today = new Date();

    setItems(
      habits.map((habit) => {
        const habitCheckIns = checkIns.filter(
          (item) => item.habitId === habit.id,
        );
        return {
          habit,
          streak: calculateStreaks(habitCheckIns).current,
          completedToday: isCompletedOnDate(checkIns, habit.id, today),
        };
      }),
    );
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Tus hábitos</h2>
          <p className="text-sm text-muted">
            Gestiona y completa tu rutina diaria.
          </p>
        </div>
        <Link
          href="/habits/new"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-white hover:bg-primary/90"
        >
          <IconPlus className="mr-1.5 h-4 w-4" />
          Nuevo
        </Link>
      </div>

      {loading ? (
        <Skeleton className="h-64 rounded-3xl" lines={6} />
      ) : (
        <Card
          padding="lg"
          className="space-y-3 border border-foreground/5 shadow-card"
        >
          {items.map((item) => (
            <HabitCard
              key={item.habit.id}
              habit={item.habit}
              streak={item.streak}
              completedToday={item.completedToday}
              href={`/habits/${item.habit.id}`}
              onToggle={async () => {
                await toggleHabitCheckIn(item.habit.id);
                await load();
              }}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
