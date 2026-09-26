"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchJSON } from "@/lib/http/fetch-json";
import { routes } from "@/shared/routes";
import type { TrendPoint } from "@/types/dashboard";
import type { Habit, HabitCheckIn, HabitNote } from "@/types/habit";
import type { AppUser } from "@/types/user";

export type HabitDetailData = {
  habit: Habit;
  checkIns: HabitCheckIn[];
  notes: HabitNote[];
  stats: {
    currentStreak: number;
    bestStreak: number;
    completionRate: number;
    monthTotal: number;
    monthCompletionRate: number;
  };
  trend: TrendPoint[];
  completedToday: boolean;
  user: AppUser;
};

export function useHabitDetail(habitId: string) {
  const [data, setData] = useState<HabitDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingNote, setSavingNote] = useState(false);
  const [toggling, setToggling] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const detail = await fetchJSON<HabitDetailData>(
        routes.HABITS.DETAIL(habitId),
      );
      setData(detail);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar el hábito",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const checkIn = useCallback(async () => {
    setToggling(true);
    try {
      await fetchJSON(routes.HABITS.CHECK_IN(habitId));
      const detail = await fetchJSON<HabitDetailData>(
        routes.HABITS.DETAIL(habitId),
      );
      setData(detail);
    } finally {
      setToggling(false);
    }
  }, [habitId]);

  const saveNote = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      setSavingNote(true);
      try {
        await fetchJSON(routes.HABITS.ADD_NOTE(habitId), {
          json: { content },
        });
        const detail = await fetchJSON<HabitDetailData>(
          routes.HABITS.DETAIL(habitId),
        );
        setData(detail);
      } finally {
        setSavingNote(false);
      }
    },
    [habitId],
  );

  return {
    data,
    loading,
    error,
    toggling,
    savingNote,
    checkIn,
    saveNote,
    refresh,
  };
}
