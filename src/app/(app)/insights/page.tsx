"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Skeleton } from "@/components/ui";
import { fetchJSON } from "@/lib/http/fetch-json";
import { routes } from "@/shared/routes";
import type { DashboardSummary } from "@/types/dashboard";

export default function InsightsPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    void fetchJSON<DashboardSummary>(routes.DASHBOARD.SUMMARY).then(setData);
  }, []);

  const insight = useMemo(() => {
    if (!data) return null;

    const best = [...data.todayHabits].sort((a, b) => b.streak - a.streak)[0];
    const pending = data.todayHabits.filter((item) => !item.completedToday);

    return {
      bestName: best?.habit.name ?? "tus hábitos",
      bestStreak: best?.streak ?? 0,
      pendingCount: pending.length,
      weekly: data.weeklyProgress,
    };
  }, [data]);

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-semibold">Insights</h2>
        <p className="text-sm text-muted">
          Lecturas rápidas generadas a partir de tus datos mock.
        </p>
      </div>

      {!insight ? (
        <Skeleton className="h-48 rounded-3xl" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card padding="lg" className="border border-foreground/5 shadow-card">
            <p className="text-sm font-medium text-primary">Racha destacada</p>
            <p className="mt-2 text-lg font-semibold">
              {insight.bestName} lleva {insight.bestStreak} días seguidos.
            </p>
          </Card>
          <Card padding="lg" className="border border-foreground/5 shadow-card">
            <p className="text-sm font-medium text-warning">Foco de hoy</p>
            <p className="mt-2 text-lg font-semibold">
              Te quedan {insight.pendingCount} hábitos por completar hoy.
            </p>
          </Card>
          <Card
            padding="lg"
            className="border border-foreground/5 shadow-card md:col-span-2"
          >
            <p className="text-sm font-medium text-success">Semana en curso</p>
            <p className="mt-2 text-lg font-semibold">
              Vas al {insight.weekly}% de tu objetivo semanal. Mantén el ritmo
              en los bloques de mañana y noche.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
