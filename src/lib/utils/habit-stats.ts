import {
  eachDayOfInterval,
  format,
  formatISO,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subDays,
} from "date-fns";
import { es } from "date-fns/locale";
import type {
  DayActivityLevel,
  HeatmapDay,
  TrendPoint,
} from "@/types/dashboard";
import type { Habit, HabitCheckIn } from "@/types/habit";
import type { ActiveGoalProgress } from "@/types/user";
import { calculateStreaks } from "@/lib/utils/date";

export function toDayKey(date: Date) {
  return formatISO(startOfDay(date), { representation: "date" });
}

export function getCheckInsForHabit(
  checkIns: HabitCheckIn[],
  habitId: string,
) {
  return checkIns.filter((item) => item.habitId === habitId);
}

export function isCompletedOnDate(
  checkIns: HabitCheckIn[],
  habitId: string,
  date: Date | string,
) {
  const day =
    typeof date === "string" ? date : toDayKey(date);
  return checkIns.some(
    (item) =>
      item.habitId === habitId &&
      item.date === day &&
      item.status === "completed",
  );
}

function activityLevel(count: number, max: number): DayActivityLevel {
  if (count <= 0 || max <= 0) return 0;
  const ratio = count / max;
  if (ratio >= 0.85) return 4;
  if (ratio >= 0.65) return 3;
  if (ratio >= 0.4) return 2;
  return 1;
}

export function buildHeatmap(
  checkIns: HabitCheckIn[],
  habitIds: string[],
  days = 30,
): HeatmapDay[] {
  const today = startOfToday();
  const start = subDays(today, days - 1);
  const range = eachDayOfInterval({ start, end: today });
  const relevant = checkIns.filter((item) => habitIds.includes(item.habitId));

  const counts = range.map((date) => {
    const key = toDayKey(date);
    const count = relevant.filter(
      (item) => item.date === key && item.status === "completed",
    ).length;
    return { date: key, count };
  });

  const max = Math.max(...counts.map((item) => item.count), 1);

  return counts.map((item) => ({
    ...item,
    level: activityLevel(item.count, max),
  }));
}

export function buildTrend(
  checkIns: HabitCheckIn[],
  habitIds: string[],
  days = 30,
): TrendPoint[] {
  const today = startOfToday();
  const start = subDays(today, days - 1);
  const range = eachDayOfInterval({ start, end: today });
  const totalHabits = Math.max(habitIds.length, 1);
  const relevant = checkIns.filter((item) => habitIds.includes(item.habitId));

  return range.map((date) => {
    const key = toDayKey(date);
    const completed = relevant.filter(
      (item) => item.date === key && item.status === "completed",
    ).length;

    return {
      date: key,
      label: format(date, "d MMM", { locale: es }),
      completed,
      total: totalHabits,
      completionRate: Math.round((completed / totalHabits) * 100),
    };
  });
}

export function buildWeeklyProgress(
  checkIns: HabitCheckIn[],
  habitIds: string[],
) {
  const today = startOfToday();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: today });
  const target = habitIds.length * days.length;
  const completed = checkIns.filter(
    (item) =>
      habitIds.includes(item.habitId) &&
      item.status === "completed" &&
      item.date >= toDayKey(weekStart) &&
      item.date <= toDayKey(today),
  ).length;

  return {
    weeklyCompleted: completed,
    weeklyTarget: Math.max(target, 1),
    weeklyProgress: Math.min(
      100,
      Math.round((completed / Math.max(target, 1)) * 100),
    ),
  };
}

export function buildActiveGoals(
  habits: Habit[],
  checkIns: HabitCheckIn[],
): ActiveGoalProgress[] {
  const monthStart = startOfMonth(startOfToday());
  const monthKey = toDayKey(monthStart);

  return habits.slice(0, 4).map((habit) => {
    const monthCheckIns = checkIns.filter(
      (item) =>
        item.habitId === habit.id &&
        item.date >= monthKey &&
        item.status === "completed",
    );
    const target = habit.goal.period === "month" ? habit.goal.target : 15;

    return {
      id: `goal-progress-${habit.id}`,
      habitId: habit.id,
      title: `${habit.name} ${target} días este mes`,
      completed: monthCheckIns.length,
      target,
      unit: "días",
      periodLabel: "este mes",
    };
  });
}

export function getHabitMonthStats(checkIns: HabitCheckIn[]) {
  const streaks = calculateStreaks(checkIns);
  const monthStart = startOfMonth(startOfToday());
  const monthKey = toDayKey(monthStart);
  const monthItems = checkIns.filter((item) => item.date >= monthKey);
  const completedMonth = monthItems.filter(
    (item) => item.status === "completed",
  ).length;
  const totalMonth = Math.max(monthItems.length, 1);
  const allCompleted = checkIns.filter(
    (item) => item.status === "completed",
  ).length;
  const allTotal = Math.max(checkIns.length, 1);

  return {
    currentStreak: streaks.current,
    bestStreak: streaks.longest,
    completionRate: Math.round((allCompleted / allTotal) * 100),
    monthTotal: completedMonth,
    monthCompletionRate: Math.round((completedMonth / totalMonth) * 100),
  };
}

export function categoryFromHabit(habit: Habit) {
  const map: Record<string, string> = {
    read: "Lectura",
    sport: "Deporte",
    meditation: "Mindfulness",
    "drink-water": "Salud",
    "sleep-better": "Descanso",
    "healthy-eating": "Nutrición",
    writing: "Creatividad",
    study: "Aprendizaje",
    gratitude: "Bienestar",
  };

  return map[habit.id] ?? "Hábito";
}

export function parseDay(date: string) {
  return parseISO(date);
}
