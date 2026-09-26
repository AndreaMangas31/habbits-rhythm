"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchJSON } from "@/lib/http/fetch-json";
import { ensureMockRegistry } from "@/lib/http/register-mocks";
import type { DashboardSummary } from "@/types/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    ensureMockRegistry();
    setLoading(true);
    setError(null);

    try {
      const summary = await fetchJSON<DashboardSummary>("/api/dashboard");
      setData(summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el dashboard",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleToday = useCallback(async (habitId: string) => {
    ensureMockRegistry();
    setPendingId(habitId);

    try {
      await fetchJSON(`/api/habits/${habitId}/check-in`, { method: "POST" });
      const summary = await fetchJSON<DashboardSummary>("/api/dashboard");
      setData(summary);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo actualizar el hábito",
      );
    } finally {
      setPendingId(null);
    }
  }, []);

  return {
    data,
    loading,
    error,
    pendingId,
    refresh,
    toggleToday,
  };
}
