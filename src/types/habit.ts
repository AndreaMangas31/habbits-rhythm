export type HabitColorToken =
  | "habit-1"
  | "habit-2"
  | "habit-3"
  | "habit-4"
  | "habit-5"
  | "habit-6"
  | "habit-7"
  | "habit-8";

export type HabitFrequency = "daily" | "weekly";
export type HabitStatus = "active" | "archived";
export type HabitGoalPeriod = "day" | "week" | "month";

export interface HabitGoal {
  id: string;
  habitId: string;
  target: number;
  period: HabitGoalPeriod;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface HabitNote {
  id: string;
  habitId: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type HabitCheckInStatus = "completed" | "missed" | "skipped";

export interface HabitCheckIn {
  id: string;
  habitId: string;
  date: string;
  value: number;
  status: HabitCheckInStatus;
  noteId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: HabitColorToken;
  frequency: HabitFrequency;
  status: HabitStatus;
  goal: HabitGoal;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface HabitSeedState {
  habits: Habit[];
  checkIns: HabitCheckIn[];
  notes: HabitNote[];
}

export interface CreateHabitInput {
  name: string;
  description: string;
  icon: string;
  color: HabitColorToken;
  frequency: HabitFrequency;
  goal: {
    target: number;
    period: HabitGoalPeriod;
    unit: string;
  };
}
