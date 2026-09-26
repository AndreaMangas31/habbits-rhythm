"use client";

import { useEffect, useState } from "react";
import { Card, Skeleton } from "@/components/ui";
import { ConsistencyHeatmap, TrendChart } from "@/components/charts";
import { fetchJSON } from "@/lib/http/fetch-json";
import { ensureMockRegistry } from "@/lib/http/register-mocks";
import type { DashboardSummary } from "@/types/dashboard";

export default function StatsPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    ensureMockRegistry();
    void fetchJSON<DashboardSummary>("/api/dashboard").then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-4 px-4 py-6 sm:px-6">
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-semibold">Estadísticas</h2>
        <p className="text-sm text-muted">
          Resumen de constancia y tendencia de los últimos 30 días.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="border border-foreground/5 text-center">
          <p className="font-stat text-3xl font-bold text-primary">
            {data.weeklyProgress}%
          </p>
          <p className="mt-1 text-sm text-muted">Progreso semanal</p>
        </Card>
        <Card className="border border-foreground/5 text-center">
          <p className="font-stat text-3xl font-bold text-success">
            {data.todayHabits.filter((item) => item.completedToday).length}
          </p>
          <p className="mt-1 text-sm text-muted">Completados hoy</p>
        </Card>
        <Card className="border border-foreground/5 text-center">
          <p className="font-stat text-3xl font-bold text-warning">
            {data.todayHabits.length}
          </p>
          <p className="mt-1 text-sm text-muted">Hábitos activos</p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card padding="lg" className="border border-foreground/5 shadow-card">
          <h3 className="mb-4 font-semibold">Constancia</h3>
          <ConsistencyHeatmap days={data.heatmap} />
        </Card>
        <Card padding="lg" className="border border-foreground/5 shadow-card">
          <h3 className="mb-4 font-semibold">Tendencia</h3>
          <TrendChart data={data.trend} />
        </Card>
      </div>
    </div>
  );
}
