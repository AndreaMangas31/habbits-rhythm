import { resetMockRoutes } from "@/lib/http/fetch-json";
import { dashboardMockRoutes } from "@/features/dashboard/mock";
import { habitDetailMockRoutes } from "@/features/habit-detail/mock";
import { habitsMockRoutes } from "@/features/habits/mock";
import { onboardingMockRoutes } from "@/features/onboarding/mock";

let registered = false;

/**
 * Wires feature `mock.ts` handlers into fetchJSON.
 * Idempotent — safe to call from client entry points.
 */
export function ensureMockRegistry() {
  if (registered) {
    return;
  }

  resetMockRoutes([
    ...dashboardMockRoutes,
    ...habitDetailMockRoutes,
    ...habitsMockRoutes,
    ...onboardingMockRoutes,
  ]);
  registered = true;
}
