"use client";

import Link from "next/link";
import { IconPlus } from "@tabler/icons-react";
import { HabitCard } from "@/components/habit";
import { Card, Skeleton } from "@/components/ui";
import { useHabits } from "@/features/habits";

export default function HabitsPage() {
  const { items, loading, toggleToday } = useHabits();

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
              onToggle={() => {
                void toggleToday(item.habit.id);
              }}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
