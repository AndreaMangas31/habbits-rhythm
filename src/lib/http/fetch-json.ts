import { matchMockRoute, type MockRoute } from "@/lib/http/mock-router";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const API_LATENCY_MS = {
  min: 180,
  max: 420,
} as const;

let registeredRoutes: MockRoute[] = [];

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

/**
 * Register mock routes from feature `mock.ts` modules.
 * Call once from the mock registry before any client fetch.
 */
export function registerMockRoutes(routes: MockRoute[]) {
  registeredRoutes = [...registeredRoutes, ...routes];
}

export function resetMockRoutes(routes: MockRoute[] = []) {
  registeredRoutes = routes;
}

export type FetchJSONOptions = Omit<RequestInit, "body"> & {
  json?: unknown;
  body?: BodyInit | null;
};

/**
 * Shared JSON client. Hooks should call this as if talking to a real backend.
 * While `NEXT_PUBLIC_USE_MOCK` is not `"false"`, requests are resolved by
 * feature mock handlers instead of `fetch`.
 */
export async function fetchJSON<T>(
  path: string,
  init: FetchJSONOptions = {},
): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const body =
    init.json !== undefined ? JSON.stringify(init.json) : (init.body ?? null);

  if (USE_MOCK) {
    await wait(randomizedLatency());

    const url = new URL(path, "http://localhost");
    const matched = matchMockRoute(registeredRoutes, method, url.pathname);

    if (!matched) {
      throw new Error(`No mock handler for ${method} ${url.pathname}`);
    }

    const parsedBody =
      body && typeof body === "string" && body.length > 0
        ? (JSON.parse(body) as unknown)
        : undefined;

    return matched.handler({
      params: matched.params,
      body: parsedBody,
      searchParams: url.searchParams,
    }) as T;
  }

  const response = await fetch(path, {
    ...init,
    method,
    headers: {
      Accept: "application/json",
      ...(init.json !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...init.headers,
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
