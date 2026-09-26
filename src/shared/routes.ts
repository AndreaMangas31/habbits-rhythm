export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRoute = {
  method: HttpMethod;
  path: string;
};

/**
 * Backend endpoints the frontend calls.
 * Each entry carries method + path so hooks don't repeat verbs.
 */
export const routes = {
  DASHBOARD: {
    SUMMARY: { method: "GET", path: "/api/dashboard" } satisfies ApiRoute,
  },
  HABITS: {
    LIST: { method: "GET", path: "/api/habits" } satisfies ApiRoute,
    CREATE: { method: "POST", path: "/api/habits" } satisfies ApiRoute,
    DETAIL: (id: string): ApiRoute => ({
      method: "GET",
      path: `/api/habits/${id}`,
    }),
    CHECK_IN: (id: string): ApiRoute => ({
      method: "POST",
      path: `/api/habits/${id}/check-in`,
    }),
    ADD_NOTE: (id: string): ApiRoute => ({
      method: "POST",
      path: `/api/habits/${id}/notes`,
    }),
  },
  CHECK_INS: {
    LIST: { method: "GET", path: "/api/check-ins" } satisfies ApiRoute,
  },
  ONBOARDING: {
    STATUS: { method: "GET", path: "/api/onboarding/status" } satisfies ApiRoute,
    COMPLETE: {
      method: "POST",
      path: "/api/onboarding/complete",
    } satisfies ApiRoute,
  },
  DEMO: {
    RESET: { method: "POST", path: "/api/demo/reset" } satisfies ApiRoute,
  },
} as const;
