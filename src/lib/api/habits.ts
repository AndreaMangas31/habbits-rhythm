import { formatISO, startOfDay, subDays } from "date-fns";
import { generateSeedState } from "@/lib/mock-data/seed";
import { MOCK_USER } from "@/lib/mock-data/user";
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
} from "@/lib/storage/local-storage";
import {
  buildActiveGoals,
  buildHeatmap,
  buildTrend,
  buildWeeklyProgress,
  getCheckInsForHabit,
  getHabitMonthStats,
  isCompletedOnDate,
  toDayKey,
} from "@/lib/utils/habit-stats";
import { calculateStreaks } from "@/lib/utils/date";
import type { DashboardSummary, TodayHabitItem } from "@/types/dashboard";
import type {
  CreateHabitInput,
  Habit,
  HabitCheckIn,
  HabitCheckInStatus,
  HabitNote,
  HabitSeedState,
} from "@/types/habit";

const API_LATENCY_MS = {
  min: 180,
  max: 420,
} as const;

export const ONBOARDING_STORAGE_KEYS = {
  selectedHabitIds: "flowhabit:onboarding:selected-habit-ids",
  completedAt: "flowhabit:onboarding:completed-at",
} as const;

function wait(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}

function randomizedLatency() {
  return (
    API_LATENCY_MS.min +
    Math.floor(Math.random() * (API_LATENCY_MS.max - API_LATENCY_MS.min + 1))
  );
}

async function withLatency<T>(factory: () => T) {
  await wait(randomizedLatency());
  return factory();
}

function getState(): HabitSeedState {
  return {
    habits: getStorageItem<Habit[]>(STORAGE_KEYS.habits, []),
    checkIns: getStorageItem<HabitCheckIn[]>(STORAGE_KEYS.checkIns, []),
    notes: getStorageItem<HabitNote[]>(STORAGE_KEYS.notes, []),
  };
}

function setState(nextState: HabitSeedState) {
  setStorageItem(STORAGE_KEYS.habits, nextState.habits);
  setStorageItem(STORAGE_KEYS.checkIns, nextState.checkIns);
  setStorageItem(STORAGE_KEYS.notes, nextState.notes);
}

function buildSeedNotes(habits: Habit[]): HabitNote[] {
  const templates = [
    "Hoy me sentí con más energía al completar este hábito.",
    "Fue más fácil de lo esperado. Voy a mantener el mismo horario.",
    "Hubo distracciones, pero igual lo completé.",
    "Pequeño avance, gran constancia.",
  ];

  return habits.slice(0, 4).flatMap((habit, habitIndex) =>
    [3, 8, 14].map((daysAgo, noteIndex) => {
      const date = subDays(new Date(), daysAgo + habitIndex);
      const createdAt = formatISO(date);

      return {
        id: `note-${habit.id}-${noteIndex}`,
        habitId: habit.id,
        date: toDayKey(date),
        content: templates[(habitIndex + noteIndex) % templates.length]!,
        createdAt,
        updatedAt: createdAt,
      };
    }),
  );
}

function applySelectedHabitFilter(seed: HabitSeedState): HabitSeedState {
  const selectedIds = getStorageItem<string[]>(
    ONBOARDING_STORAGE_KEYS.selectedHabitIds,
    [],
  );

  if (selectedIds.length === 0) {
    return {
      ...seed,
      notes: buildSeedNotes(seed.habits),
    };
  }

  const habits = seed.habits.filter((habit) => selectedIds.includes(habit.id));
  const habitIds = new Set(habits.map((habit) => habit.id));
  const checkIns = seed.checkIns.filter((item) => habitIds.has(item.habitId));

  return {
    habits,
    checkIns,
    notes: buildSeedNotes(habits),
  };
}

function ensureInitialized() {
  const initialized = getStorageItem<boolean>(STORAGE_KEYS.initialized, false);

  if (initialized) {
    return;
  }

  const seedState = applySelectedHabitFilter(generateSeedState());
  setState(seedState);
  setStorageItem(STORAGE_KEYS.initialized, true);
}

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function checkInStatus(value: number): HabitCheckInStatus {
  if (value > 0) {
    return "completed";
  }

  return "missed";
}

function ensureBrowserRuntime() {
  if (typeof window === "undefined") {
    throw new Error("Mock API requires browser runtime with localStorage.");
  }
}

function getActiveHabits(state: HabitSeedState) {
  return state.habits.filter((habit) => habit.status === "active");
}

/*
 * This module is the app's only data-access boundary.
 * If a real backend is added later, replace implementations here without
 * touching features/components that consume these async methods.
 */
export async function getHabits() {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    return getActiveHabits(getState());
  });
}

export async function getHabitById(id: string) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    return getState().habits.find((item) => item.id === id) ?? null;
  });
}

export async function getCheckIns(habitId?: string) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const checkIns = getState().checkIns;

    if (!habitId) {
      return checkIns;
    }

    return getCheckInsForHabit(checkIns, habitId);
  });
}

export async function getNotes(habitId?: string) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const notes = getState().notes;

    if (!habitId) {
      return notes;
    }

    return notes
      .filter((note) => note.habitId === habitId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  });
}

export async function createHabit(data: CreateHabitInput) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const state = getState();
    const now = new Date().toISOString();
    const habitId = makeId("habit");

    const habit: Habit = {
      id: habitId,
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      frequency: data.frequency,
      status: "active",
      goal: {
        id: makeId("goal"),
        habitId,
        target: data.goal.target,
        period: data.goal.period,
        unit: data.goal.unit,
        createdAt: now,
        updatedAt: now,
      },
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    };

    setState({
      ...state,
      habits: [...state.habits, habit],
    });

    return habit;
  });
}

export async function checkInHabit(
  id: string,
  date: Date = new Date(),
  value = 1,
) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const state = getState();
    const day = toDayKey(date);
    const existing = state.checkIns.find(
      (item) => item.habitId === id && item.date === day,
    );
    const now = new Date().toISOString();

    if (existing) {
      const updated: HabitCheckIn = {
        ...existing,
        value,
        status: checkInStatus(value),
        updatedAt: now,
      };

      setState({
        ...state,
        checkIns: state.checkIns.map((item) =>
          item.id === existing.id ? updated : item,
        ),
      });

      return updated;
    }

    const nextCheckIn: HabitCheckIn = {
      id: makeId("checkin"),
      habitId: id,
      date: day,
      value,
      status: checkInStatus(value),
      createdAt: now,
      updatedAt: now,
    };

    setState({
      ...state,
      checkIns: [...state.checkIns, nextCheckIn],
    });

    return nextCheckIn;
  });
}

export async function toggleHabitCheckIn(
  id: string,
  date: Date = new Date(),
) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const state = getState();
    const day = toDayKey(date);
    const existing = state.checkIns.find(
      (item) => item.habitId === id && item.date === day,
    );
    const now = new Date().toISOString();
    const habit = state.habits.find((item) => item.id === id);
    const completedValue = habit?.goal.target ?? 1;

    if (existing?.status === "completed") {
      const updated: HabitCheckIn = {
        ...existing,
        value: 0,
        status: "missed",
        updatedAt: now,
      };

      setState({
        ...state,
        checkIns: state.checkIns.map((item) =>
          item.id === existing.id ? updated : item,
        ),
      });

      return updated;
    }

    if (existing) {
      const updated: HabitCheckIn = {
        ...existing,
        value: completedValue,
        status: "completed",
        updatedAt: now,
      };

      setState({
        ...state,
        checkIns: state.checkIns.map((item) =>
          item.id === existing.id ? updated : item,
        ),
      });

      return updated;
    }

    const nextCheckIn: HabitCheckIn = {
      id: makeId("checkin"),
      habitId: id,
      date: day,
      value: completedValue,
      status: "completed",
      createdAt: now,
      updatedAt: now,
    };

    setState({
      ...state,
      checkIns: [...state.checkIns, nextCheckIn],
    });

    return nextCheckIn;
  });
}

export async function addNote(habitId: string, content: string, date = new Date()) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const state = getState();
    const now = new Date().toISOString();
    const note: HabitNote = {
      id: makeId("note"),
      habitId,
      date: toDayKey(date),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };

    setState({
      ...state,
      notes: [note, ...state.notes],
    });

    return note;
  });
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const state = getState();
    const habits = getActiveHabits(state);
    const habitIds = habits.map((habit) => habit.id);
    const today = startOfDay(new Date());
    const weekly = buildWeeklyProgress(state.checkIns, habitIds);

    const todayHabits: TodayHabitItem[] = habits.map((habit) => {
      const habitCheckIns = getCheckInsForHabit(state.checkIns, habit.id);
      const streaks = calculateStreaks(habitCheckIns);
      const checkIn = habitCheckIns.find((item) => item.date === toDayKey(today));

      return {
        habit,
        completedToday: isCompletedOnDate(state.checkIns, habit.id, today),
        streak: streaks.current,
        checkIn,
      };
    });

    return {
      user: MOCK_USER,
      weeklyProgress: weekly.weeklyProgress,
      weeklyCompleted: weekly.weeklyCompleted,
      weeklyTarget: weekly.weeklyTarget,
      todayHabits,
      heatmap: buildHeatmap(state.checkIns, habitIds, 30),
      trend: buildTrend(state.checkIns, habitIds, 30),
      goals: buildActiveGoals(habits, state.checkIns),
    };
  });
}

export async function getHabitDetail(id: string) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const state = getState();
    const habit = state.habits.find((item) => item.id === id);

    if (!habit) {
      return null;
    }

    const checkIns = getCheckInsForHabit(state.checkIns, id);
    const notes = state.notes
      .filter((note) => note.habitId === id)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    const stats = getHabitMonthStats(checkIns);
    const trend = buildTrend(checkIns, [id], 30);
    const completedToday = isCompletedOnDate(checkIns, id, new Date());

    return {
      habit,
      checkIns,
      notes,
      stats,
      trend,
      completedToday,
      user: MOCK_USER,
    };
  });
}

export function isOnboardingCompleted() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    getStorageItem<string | null>(ONBOARDING_STORAGE_KEYS.completedAt, null),
  );
}

export function resetMockData() {
  ensureBrowserRuntime();
  setStorageItem(STORAGE_KEYS.initialized, false);
  setStorageItem(STORAGE_KEYS.habits, []);
  setStorageItem(STORAGE_KEYS.checkIns, []);
  setStorageItem(STORAGE_KEYS.notes, []);
  ensureInitialized();
}
