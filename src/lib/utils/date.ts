import {
  endOfMonth,
  endOfWeek,
  format,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { HabitCheckIn } from "@/types/habit";

export type StreakSummary = {
  current: number;
  longest: number;
};

export type TimeBucket = {
  key: string;
  label: string;
  completed: number;
  total: number;
  completionRate: number;
};

export function formatDayLabel(
  dateValue: string | Date,
  pattern = "EEE d MMM",
) {
  const date = typeof dateValue === "string" ? parseISO(dateValue) : dateValue;
  return format(date, pattern);
}

export function calculateStreaks(checkIns: HabitCheckIn[]): StreakSummary {
  const daily = [...checkIns]
    .sort((a, b) => (a.date > b.date ? 1 : -1))
    .map((item) => item.status === "completed");

  let longest = 0;
  let currentRun = 0;

  daily.forEach((completed) => {
    if (!completed) {
      currentRun = 0;
      return;
    }

    currentRun += 1;
    longest = Math.max(longest, currentRun);
  });

  let current = 0;
  for (let index = daily.length - 1; index >= 0; index -= 1) {
    if (!daily[index]) {
      break;
    }

    current += 1;
  }

  return { current, longest };
}

function percentage(completed: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}

export function aggregateByWeek(checkIns: HabitCheckIn[]) {
  const buckets = new Map<string, TimeBucket>();

  checkIns.forEach((checkIn) => {
    const date = parseISO(checkIn.date);
    const bucketStart = startOfWeek(date, { weekStartsOn: 1 });
    const bucketEnd = endOfWeek(date, { weekStartsOn: 1 });
    const key = format(bucketStart, "yyyy-MM-dd");
    const existing = buckets.get(key);

    if (existing) {
      existing.total += 1;
      existing.completed += checkIn.status === "completed" ? 1 : 0;
      existing.completionRate = percentage(existing.completed, existing.total);
      return;
    }

    const completed = checkIn.status === "completed" ? 1 : 0;

    buckets.set(key, {
      key,
      label: `${format(bucketStart, "dd MMM")} - ${format(bucketEnd, "dd MMM")}`,
      completed,
      total: 1,
      completionRate: percentage(completed, 1),
    });
  });

  return [...buckets.values()].sort((a, b) => (a.key > b.key ? 1 : -1));
}

export function aggregateByMonth(checkIns: HabitCheckIn[]) {
  const buckets = new Map<string, TimeBucket>();

  checkIns.forEach((checkIn) => {
    const date = parseISO(checkIn.date);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const key = format(monthStart, "yyyy-MM");
    const existing = buckets.get(key);

    if (existing) {
      existing.total += 1;
      existing.completed += checkIn.status === "completed" ? 1 : 0;
      existing.completionRate = percentage(existing.completed, existing.total);
      return;
    }

    const completed = checkIn.status === "completed" ? 1 : 0;

    buckets.set(key, {
      key,
      label: `${format(monthStart, "MMM yyyy")} (${format(monthStart, "d")}-${format(monthEnd, "d")})`,
      completed,
      total: 1,
      completionRate: percentage(completed, 1),
    });
  });

  return [...buckets.values()].sort((a, b) => (a.key > b.key ? 1 : -1));
}
