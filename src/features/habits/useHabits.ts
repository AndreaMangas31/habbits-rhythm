"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchJSON } from "@/lib/http/fetch-json";
import { routes } from "@/shared/routes";
import { calculateStreaks } from "@/lib/utils/date";
import { isCompletedOnDate } from "@/lib/utils/habit-stats";
import type { CreateHabitInput, Habit, HabitCheckIn } from "@/types/habit";

export type HabitListItem = {
  habit: Habit;
  streak: number;
  completedToday: boolean;
};

export function useHabits() {
  const [items, setItems] = useState<HabitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [habits, checkIns] = await Promise.all([
        fetchJSON<Habit[]>(routes.HABITS.LIST),
        fetchJSON<HabitCheckIn[]>(routes.CHECK_INS.LIST),
      ]);
      const today = new Date();

      setItems(
        habits.map((habit) => {
          const habitCheckIns = checkIns.filter(
            (item) => item.habitId === habit.id,
          );
          return {
            habit,
            streak: calculateStreaks(habitCheckIns).current,
            completedToday: isCompletedOnDate(checkIns, habit.id, today),
          };
        }),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los hábitos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleToday = useCallback(
    async (habitId: string) => {
      await fetchJSON(routes.HABITS.CHECK_IN(habitId));
      await refresh();
    },
    [refresh],
  );

  const createHabit = useCallback(
    async (input: CreateHabitInput) => {
      const habit = await fetchJSON<Habit>(routes.HABITS.CREATE, {
        json: input,
      });
      await refresh();
      return habit;
    },
    [refresh],
  );

  return {
    items,
    loading,
    error,
    refresh,
    toggleToday,
    createHabit,
  };
}
