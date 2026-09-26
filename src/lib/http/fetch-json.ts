import { type ApiRoute } from "@/shared/routes";
import { resolveMock } from "@/lib/http/resolve-mock";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const API_LATENCY_MS = {
  min: 180,
  max: 420,
} as const;

function wait(duration: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}

function randomizedLatency() {
  return (
    API_LATENCY_MS.min +
    Math.floor(Math.random() * (API_LATENCY_MS.max - API_LATENCY_MS.min + 1))
  );
}

export type FetchJSONOptions = {
  json?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  /** Extra query string, e.g. `habitId=read` */
  query?: Record<string, string | undefined>;
};

function withQuery(path: string, query?: FetchJSONOptions["query"]) {
  if (!query) {
    return path;
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, value);
    }
  });

  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

/**
 * Shared JSON client. Pass a route from `shared/routes.ts`
 * (`routes.HABITS.LIST`, `routes.HABITS.CREATE`, …).
 */
export async function fetchJSON<T>(
  route: ApiRoute,
  init: FetchJSONOptions = {},
): Promise<T> {
  const path = withQuery(route.path, init.query);

  if (USE_MOCK) {
    await wait(randomizedLatency());
    const url = new URL(path, "http://localhost");

    return resolveMock(route, {
      json: init.json,
      searchParams: url.searchParams,
    }) as T;
  }

  const response = await fetch(path, {
    method: route.method,
    headers: {
      Accept: "application/json",
      ...(init.json !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...init.headers,
    },
    body: init.json !== undefined ? JSON.stringify(init.json) : undefined,
    signal: init.signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
