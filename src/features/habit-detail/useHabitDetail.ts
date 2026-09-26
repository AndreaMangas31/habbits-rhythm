"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addNote,
  getHabitDetail,
  toggleHabitCheckIn,
} from "@/lib/api/habits";
import type { Habit, HabitCheckIn, HabitNote } from "@/types/habit";
import type { TrendPoint } from "@/types/dashboard";

type HabitDetailData = {
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
      const detail = await getHabitDetail(habitId);
      if (!detail) {
        setError("Hábito no encontrado");
        setData(null);
        return;
      }
      setData(detail);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar el hábito");
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
      await toggleHabitCheckIn(habitId);
      const detail = await getHabitDetail(habitId);
      if (detail) setData(detail);
    } finally {
      setToggling(false);
    }
  }, [habitId]);

  const saveNote = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      setSavingNote(true);
      try {
        await addNote(habitId, content);
        const detail = await getHabitDetail(habitId);
        if (detail) setData(detail);
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
