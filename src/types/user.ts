export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarInitials: string;
}

export interface ActiveGoalProgress {
  id: string;
  habitId: string;
  title: string;
  completed: number;
  target: number;
  unit: string;
  periodLabel: string;
}
