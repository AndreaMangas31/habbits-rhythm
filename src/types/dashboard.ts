import type { Habit, HabitCheckIn } from "@/types/habit";
import type { ActiveGoalProgress, AppUser } from "@/types/user";

export type DayActivityLevel = 0 | 1 | 2 | 3 | 4;

export interface HeatmapDay {
  date: string;
  count: number;
  level: DayActivityLevel;
}

export interface TrendPoint {
  date: string;
  label: string;
  completionRate: number;
  completed: number;
  total: number;
}

export interface TodayHabitItem {
  habit: Habit;
  completedToday: boolean;
  streak: number;
  checkIn?: HabitCheckIn;
}

export interface DashboardSummary {
  user: AppUser;
  weeklyProgress: number;
  weeklyCompleted: number;
  weeklyTarget: number;
  todayHabits: TodayHabitItem[];
  heatmap: HeatmapDay[];
  trend: TrendPoint[];
  goals: ActiveGoalProgress[];
}
