import { formatISO, startOfDay } from "date-fns";
import { generateSeedState } from "@/lib/mock-data/seed";
import {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
} from "@/lib/storage/local-storage";
import type {
  CreateHabitInput,
  Habit,
  HabitCheckIn,
  HabitCheckInStatus,
  HabitSeedState,
} from "@/types/habit";

const API_LATENCY_MS = {
  min: 300,
  max: 600,
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
    notes: getStorageItem(STORAGE_KEYS.notes, []),
  };
}

function setState(nextState: HabitSeedState) {
  setStorageItem(STORAGE_KEYS.habits, nextState.habits);
  setStorageItem(STORAGE_KEYS.checkIns, nextState.checkIns);
  setStorageItem(STORAGE_KEYS.notes, nextState.notes);
}

function ensureInitialized() {
  const initialized = getStorageItem<boolean>(STORAGE_KEYS.initialized, false);

  if (initialized) {
    return;
  }

  const seedState = generateSeedState();
  setState(seedState);
  setStorageItem(STORAGE_KEYS.initialized, true);
}

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function toDayKey(date: Date) {
  return formatISO(startOfDay(date), { representation: "date" });
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

/*
 * This module is the app's only data-access boundary.
 * If a real backend is added later, replace implementations here without
 * touching features/components that consume these async methods.
 */
export async function getHabits() {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    return getState().habits;
  });
}

export async function getHabitById(id: string) {
  return withLatency(() => {
    ensureBrowserRuntime();
    ensureInitialized();

    const habit = getState().habits.find((item) => item.id === id);

    if (!habit) {
      return null;
    }

    return habit;
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
    const existing = state.checkIns.find(
      (item) => item.habitId === id && item.date === toDayKey(date),
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
      date: toDayKey(date),
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
