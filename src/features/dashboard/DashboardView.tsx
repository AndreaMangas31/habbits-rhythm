"use client";

import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { HabitCard } from "@/components/habit";
import {
  ConsistencyHeatmap,
  ProgressRing,
  TrendChart,
} from "@/components/charts";
import { Button, Card, Skeleton } from "@/components/ui";
import { useDashboard } from "@/features/dashboard/useDashboard";
import { cn } from "@/lib/utils/cn";

export function DashboardView() {
  const { data, loading, error, toggleToday, pendingId } = useDashboard();

  if (loading && !data) {
    return (
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-10 text-center sm:px-6">
        <p className="text-muted">{error ?? "Sin datos disponibles"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-5 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl bg-linear-to-br from-[#6d5ff3] via-[#7c6ef8] to-[#5b8def] p-6 text-white shadow-card sm:p-7">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="max-w-md text-center sm:text-left">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Sigue así, vas increíble
            </h2>
            <p className="mt-2 text-sm text-white/85 sm:text-base">
              {data.weeklyProgress}% de tu objetivo semanal · {data.weeklyCompleted}/
              {data.weeklyTarget} check-ins
            </p>
            <Button
              variant="ghost"
              className="mt-5 h-10 rounded-xl bg-white/15 text-white hover:bg-white/25"
              onClick={() => {
                document
                  .getElementById("today-habits")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Ver progreso
              <IconArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <ProgressRing value={data.weeklyProgress} label="esta semana" />
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card
          id="today-habits"
          padding="lg"
          className="border border-foreground/5 shadow-card"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Hábitos de hoy</h3>
            <Link
              href="/habits"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div
            className={cn(
              "space-y-3",
              data.todayHabits.length > 8 && "max-h-[28rem] overflow-y-auto pr-1",
            )}
          >
            {data.todayHabits.map((item) => (
              <HabitCard
                key={item.habit.id}
                habit={item.habit}
                completedToday={item.completedToday}
                streak={item.streak}
                href={`/habits/${item.habit.id}`}
                onToggle={() => {
                  if (pendingId !== item.habit.id) {
                    void toggleToday(item.habit.id);
                  }
                }}
                className={pendingId === item.habit.id ? "opacity-70" : undefined}
              />
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card padding="lg" className="border border-foreground/5 shadow-card">
            <h3 className="mb-4 text-lg font-semibold">Constancia</h3>
            <p className="mb-3 text-sm text-muted">Últimos 30 días</p>
            <ConsistencyHeatmap days={data.heatmap} />
          </Card>

          <Card padding="lg" className="border border-foreground/5 shadow-card">
            <h3 className="mb-1 text-lg font-semibold">Tendencia</h3>
            <p className="mb-3 text-sm text-muted">Completado diario · 30 días</p>
            <TrendChart data={data.trend} />
          </Card>
        </div>
      </div>

      <Card padding="lg" className="border border-foreground/5 shadow-card">
        <h3 className="mb-4 text-lg font-semibold">Objetivos activos</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {data.goals.map((goal) => {
            const percent = Math.min(
              100,
              Math.round((goal.completed / Math.max(goal.target, 1)) * 100),
            );

            return (
              <div
                key={goal.id}
                className="rounded-2xl border border-foreground/6 bg-surface-hover/60 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-foreground">{goal.title}</p>
                  <span className="font-stat text-sm text-muted">
                    {goal.completed}/{goal.target}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/8">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
