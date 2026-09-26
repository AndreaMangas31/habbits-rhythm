import type { MockRoute } from "@/lib/http/mock-router";
import {
  clearOnboardingAndReset,
  isOnboardingCompleted,
  resetMockStore,
} from "@/lib/mock/store";

export const onboardingMockRoutes: MockRoute[] = [
  {
    method: "GET",
    pattern: "/api/onboarding/status",
    handler: () => ({ completed: isOnboardingCompleted() }),
  },
  {
    method: "POST",
    pattern: "/api/onboarding/complete",
    handler: () => {
      // Selection keys are written by the hook before this call.
      resetMockStore();
      return { ok: true };
    },
  },
  {
    method: "POST",
    pattern: "/api/demo/reset",
    handler: () => {
      clearOnboardingAndReset();
      return { ok: true };
    },
  },
];
