"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchJSON } from "@/lib/http/fetch-json";
import { routes } from "@/shared/routes";
import type { DashboardSummary } from "@/types/dashboard";

export function useDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const summary = await fetchJSON<DashboardSummary>(
          routes.DASHBOARD.SUMMARY,
        );
        if (!cancelled) {
          setData(summary);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el dashboard",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const summary = await fetchJSON<DashboardSummary>(routes.DASHBOARD.SUMMARY);
      setData(summary);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo cargar el dashboard",
      );
    }
  }, []);

  const toggleToday = useCallback(async (habitId: string) => {
    setPendingId(habitId);

    try {
      await fetchJSON(routes.HABITS.CHECK_IN(habitId));
      const summary = await fetchJSON<DashboardSummary>(routes.DASHBOARD.SUMMARY);
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
