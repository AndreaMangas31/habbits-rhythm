import type { MockRoute } from "@/lib/http/mock-router";
import {
  createHabitInStore,
  readActiveHabits,
  readCheckIns,
  toggleCheckInInStore,
} from "@/lib/mock/store";
import type { CreateHabitInput } from "@/types/habit";

export const habitsMockRoutes: MockRoute[] = [
  {
    method: "GET",
    pattern: "/api/habits",
    handler: () => readActiveHabits(),
  },
  {
    method: "POST",
    pattern: "/api/habits",
    handler: ({ body }) => createHabitInStore(body as CreateHabitInput),
  },
  {
    method: "GET",
    pattern: "/api/check-ins",
    handler: ({ searchParams }) => {
      const habitId = searchParams.get("habitId") ?? undefined;
      return readCheckIns(habitId);
    },
  },
  {
    method: "POST",
    pattern: "/api/habits/:id/check-in",
    handler: ({ params }) => toggleCheckInInStore(params.id!),
  },
];
