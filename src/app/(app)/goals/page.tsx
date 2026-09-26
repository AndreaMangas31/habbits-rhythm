"use client";

import { useEffect, useState } from "react";
import { Card, Skeleton } from "@/components/ui";
import { fetchJSON } from "@/lib/http/fetch-json";
import { ensureMockRegistry } from "@/lib/http/register-mocks";
import type { ActiveGoalProgress } from "@/types/user";
import type { DashboardSummary } from "@/types/dashboard";

export default function GoalsPage() {
  const [goals, setGoals] = useState<ActiveGoalProgress[] | null>(null);

  useEffect(() => {
    ensureMockRegistry();
    void fetchJSON<DashboardSummary>("/api/dashboard").then((data) =>
      setGoals(data.goals),
    );
  }, []);

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-semibold">Objetivos</h2>
        <p className="text-sm text-muted">
          Metas mensuales derivadas de tus hábitos activos.
        </p>
      </div>

      {!goals ? (
        <Skeleton className="h-48 rounded-3xl" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => {
            const percent = Math.min(
              100,
              Math.round((goal.completed / Math.max(goal.target, 1)) * 100),
            );

            return (
              <Card
                key={goal.id}
                padding="lg"
                className="border border-foreground/5 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{goal.title}</h3>
                  <span className="font-stat text-sm text-muted">
                    {goal.completed}/{goal.target}
                  </span>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-foreground/8">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted">{percent}% completado</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
