import type { MockRoute } from "@/lib/http/mock-router";
import { readDashboardSummary } from "@/lib/mock/store";

export const dashboardMockRoutes: MockRoute[] = [
  {
    method: "GET",
    pattern: "/api/dashboard",
    handler: () => readDashboardSummary(),
  },
];
