import {
  addDays,
  endOfDay,
  formatISO,
  isWeekend,
  startOfDay,
  startOfToday,
  subDays,
} from "date-fns";
import { habitsMock } from "@/features/habits/mock";
import type {
  Habit,
  HabitCheckIn,
  HabitCheckInStatus,
  HabitGoal,
  HabitSeedState,
} from "@/types/habit";

export const HISTORY_DAYS = 90;

function idFor(prefix: string, index: number) {
  return `${prefix}-${index.toString().padStart(4, "0")}`;
}

function toDayKey(date: Date) {
  return formatISO(startOfDay(date), { representation: "date" });
}

function createHabitGoal(
  habitId: string,
  createdAt: string,
  index: number,
): HabitGoal {
  const targets = [8, 1, 45, 20, 1, 10, 7, 10, 5];
  const units = [
    "vasos",
    "sesion",
    "min",
    "paginas",
    "sesion",
    "min",
    "horas",
    "min",
    "min",
  ];

  return {
    id: `goal-${habitId}`,
    habitId,
    target: targets[index] ?? 1,
    period: "day",
    unit: units[index] ?? "sesion",
    createdAt,
    updatedAt: createdAt,
  };
}

function buildHabits(): Habit[] {
  const createdAt = formatISO(subDays(startOfToday(), HISTORY_DAYS));

  return habitsMock.map((suggestion, index) => {
    const habitId = suggestion.id;

    return {
      id: habitId,
      name: suggestion.name,
      description: suggestion.description,
      icon: suggestion.iconName,
      color: suggestion.color,
      frequency: "daily",
      status: "active",
      goal: createHabitGoal(habitId, createdAt, index),
      createdAt,
      updatedAt: createdAt,
      archivedAt: null,
    };
  });
}

function completionStatusForDay(
  dayIndex: number,
  totalDays: number,
  habitIndex: number,
): HabitCheckInStatus {
  const progressRatio = dayIndex / totalDays;
  const baseScore = 0.38 + habitIndex * 0.035 + progressRatio * 0.26;
  const streakPulse = Math.sin((dayIndex + habitIndex * 1.7) / 5) * 0.11;
  const plannedBreak = (dayIndex + habitIndex * 2) % 17 === 0 ? -0.35 : 0;
  const microDrop = (dayIndex + habitIndex) % 11 === 0 ? -0.2 : 0;
  const weekendPenalty = (dayIndex + habitIndex) % 8 === 0 ? -0.18 : 0;
  const score =
    baseScore + streakPulse + plannedBreak + microDrop + weekendPenalty;

  if (score >= 0.62) {
    return "completed";
  }

  if (score <= 0.24) {
    return "skipped";
  }

  return "missed";
}

function valueForStatus(
  status: HabitCheckInStatus,
  habit: Habit,
  date: Date,
  dayIndex: number,
) {
  if (status !== "completed") {
    return 0;
  }

  const weekendFactor = isWeekend(date) ? 0.86 : 1;
  const momentumFactor = 0.8 + (dayIndex / HISTORY_DAYS) * 0.25;

  return Math.max(
    1,
    Math.round(habit.goal.target * weekendFactor * momentumFactor),
  );
}

function buildCheckIns(habits: Habit[]): HabitCheckIn[] {
  const startDate = subDays(startOfToday(), HISTORY_DAYS - 1);
  const checkIns: HabitCheckIn[] = [];

  habits.forEach((habit, habitIndex) => {
    for (let dayIndex = 0; dayIndex < HISTORY_DAYS; dayIndex += 1) {
      const date = addDays(startDate, dayIndex);
      const status = completionStatusForDay(dayIndex, HISTORY_DAYS, habitIndex);
      const createdAt = formatISO(endOfDay(date));

      checkIns.push({
        id: idFor(`checkin-${habit.id}`, dayIndex),
        habitId: habit.id,
        date: toDayKey(date),
        value: valueForStatus(status, habit, date, dayIndex),
        status,
        createdAt,
        updatedAt: createdAt,
      });
    }
  });

  return checkIns;
}

export function generateSeedState(): HabitSeedState {
  const habits = buildHabits();
  const checkIns = buildCheckIns(habits);

  return {
    habits,
    checkIns,
    notes: [],
  };
}
