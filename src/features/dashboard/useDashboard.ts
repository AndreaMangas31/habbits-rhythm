"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getDashboardSummary,
  toggleHabitCheckIn,
} from "@/lib/api/habits";
import type { DashboardSummary } from "@/types/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const summary = await getDashboardSummary();
      setData(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleToday = useCallback(
    async (habitId: string) => {
      setPendingId(habitId);

      try {
        await toggleHabitCheckIn(habitId);
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo actualizar el hábito",
        );
      } finally {
        setPendingId(null);
      }
    },
    [],
  );

  return {
    data,
    loading,
    error,
    pendingId,
    refresh,
    toggleToday,
  };
}
