import { formatISO, startOfDay, subDays } from "date-fns";
import { habitNotesMock } from "@/features/habit-detail/mock";
import { userMock } from "@/features/onboarding/mock";
import { generateSeedState } from "@/lib/mock-data/seed";
import {
  STORAGE_KEYS,
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from "@/lib/storage/local-storage";
import { calculateStreaks } from "@/lib/utils/date";
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
import type { DashboardSummary, TodayHabitItem } from "@/types/dashboard";
import type {
  CreateHabitInput,
  Habit,
  HabitCheckIn,
  HabitNote,
  HabitSeedState,
} from "@/types/habit";

export const ONBOARDING_STORAGE_KEYS = {
  selectedHabitIds: "flowhabit:onboarding:selected-habit-ids",
  completedAt: "flowhabit:onboarding:completed-at",
} as const;

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
  return habits.slice(0, 4).flatMap((habit, habitIndex) =>
    [3, 8, 14].map((daysAgo, noteIndex) => {
      const date = subDays(new Date(), daysAgo + habitIndex);
      const createdAt = formatISO(date);

      return {
        id: `note-${habit.id}-${noteIndex}`,
        habitId: habit.id,
        date: toDayKey(date),
        content: habitNotesMock[(habitIndex + noteIndex) % habitNotesMock.length]!,
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

function ensureBrowserRuntime() {
  if (typeof window === "undefined") {
    throw new Error("Mock store requires browser runtime with localStorage.");
  }
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

function getActiveHabits(state: HabitSeedState) {
  return state.habits.filter((habit) => habit.status === "active");
}

export function readActiveHabits() {
  ensureBrowserRuntime();
  ensureInitialized();
  return getActiveHabits(getState());
}

export function readCheckIns(habitId?: string) {
  ensureBrowserRuntime();
  ensureInitialized();
  const checkIns = getState().checkIns;
  return habitId ? getCheckInsForHabit(checkIns, habitId) : checkIns;
}

export function createHabitInStore(data: CreateHabitInput) {
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
}

export function toggleCheckInInStore(id: string, date: Date = new Date()) {
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
}

export function addNoteInStore(
  habitId: string,
  content: string,
  date = new Date(),
) {
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
}

export function readDashboardSummary(): DashboardSummary {
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
      user: userMock,
      weeklyProgress: weekly.weeklyProgress,
    weeklyCompleted: weekly.weeklyCompleted,
    weeklyTarget: weekly.weeklyTarget,
    todayHabits,
    heatmap: buildHeatmap(state.checkIns, habitIds, 30),
    trend: buildTrend(state.checkIns, habitIds, 30),
    goals: buildActiveGoals(habits, state.checkIns),
  };
}

export function readHabitDetail(id: string) {
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

  return {
    habit,
    checkIns,
    notes,
    stats: getHabitMonthStats(checkIns),
    trend: buildTrend(checkIns, [id], 30),
    completedToday: isCompletedOnDate(checkIns, id, new Date()),
    user: userMock,
  };
}

export function isOnboardingCompleted() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(
    getStorageItem<string | null>(ONBOARDING_STORAGE_KEYS.completedAt, null),
  );
}

export function resetMockStore() {
  ensureBrowserRuntime();
  setStorageItem(STORAGE_KEYS.initialized, false);
  setStorageItem(STORAGE_KEYS.habits, []);
  setStorageItem(STORAGE_KEYS.checkIns, []);
  setStorageItem(STORAGE_KEYS.notes, []);
  ensureInitialized();
}

export function clearOnboardingAndReset() {
  ensureBrowserRuntime();
  removeStorageItem(ONBOARDING_STORAGE_KEYS.completedAt);
  removeStorageItem(ONBOARDING_STORAGE_KEYS.selectedHabitIds);
  resetMockStore();
}
