import { routes, type ApiRoute } from "@/shared/routes";
import {
  addNoteInStore,
  clearOnboardingAndReset,
  createHabitInStore,
  isOnboardingCompleted,
  readActiveHabits,
  readCheckIns,
  readDashboardSummary,
  readHabitDetail,
  resetMockStore,
  toggleCheckInInStore,
} from "@/lib/mock/store";
import type { CreateHabitInput } from "@/types/habit";

type ResolveOptions = {
  json?: unknown;
  searchParams: URLSearchParams;
};

/**
 * Answers API routes while there is no backend.
 * Feature `mock.ts` files only hold data; mutations live in the store.
 */
export function resolveMock(
  route: ApiRoute,
  options: ResolveOptions,
): unknown {
  const { json, searchParams } = options;
  const { method, path } = route;

  if (
    method === routes.DASHBOARD.SUMMARY.method &&
    path === routes.DASHBOARD.SUMMARY.path
  ) {
    return readDashboardSummary();
  }

  if (method === routes.HABITS.LIST.method && path === routes.HABITS.LIST.path) {
    return readActiveHabits();
  }

  if (
    method === routes.HABITS.CREATE.method &&
    path === routes.HABITS.CREATE.path
  ) {
    return createHabitInStore(json as CreateHabitInput);
  }

  if (
    method === routes.CHECK_INS.LIST.method &&
    path.startsWith(routes.CHECK_INS.LIST.path)
  ) {
    return readCheckIns(searchParams.get("habitId") ?? undefined);
  }

  if (
    method === routes.ONBOARDING.STATUS.method &&
    path === routes.ONBOARDING.STATUS.path
  ) {
    return { completed: isOnboardingCompleted() };
  }

  if (
    method === routes.ONBOARDING.COMPLETE.method &&
    path === routes.ONBOARDING.COMPLETE.path
  ) {
    resetMockStore();
    return { ok: true };
  }

  if (method === routes.DEMO.RESET.method && path === routes.DEMO.RESET.path) {
    clearOnboardingAndReset();
    return { ok: true };
  }

  const habitDetail = path.match(/^\/api\/habits\/([^/]+)$/);
  if (method === "GET" && habitDetail) {
    const detail = readHabitDetail(habitDetail[1]!);
    if (!detail) {
      throw new Error("Hábito no encontrado");
    }
    return detail;
  }

  const checkIn = path.match(/^\/api\/habits\/([^/]+)\/check-in$/);
  if (method === "POST" && checkIn) {
    return toggleCheckInInStore(checkIn[1]!);
  }

  const notes = path.match(/^\/api\/habits\/([^/]+)\/notes$/);
  if (method === "POST" && notes) {
    const content =
      typeof json === "object" &&
      json !== null &&
      "content" in json &&
      typeof (json as { content: unknown }).content === "string"
        ? (json as { content: string }).content
        : "";
    return addNoteInStore(notes[1]!, content);
  }

  throw new Error(`No mock response for ${method} ${path}`);
}
