export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRoute = {
  method: HttpMethod;
  path: string;
};

type RelativeRoute = {
  method: HttpMethod;
  /** Path relative to the resource base. `""` → base, `"/{id}"`, `"/notes"`, … */
  path: string;
};

type RouteChildren = Record<
  string,
  RelativeRoute | ((...args: string[]) => RelativeRoute)
>;

type ResolvedRoutes<T extends RouteChildren> = {
  readonly base: string;
} & {
  readonly [K in keyof T]: T[K] extends (...args: infer A) => RelativeRoute
    ? (...args: A) => ApiRoute
    : ApiRoute;
};

function joinPath(base: string, relative: string) {
  if (!relative) {
    return base;
  }

  const normalizedBase = base.replace(/\/$/, "");
  const normalizedRelative = relative.startsWith("/")
    ? relative
    : `/${relative}`;

  return `${normalizedBase}${normalizedRelative}`;
}

/**
 * Builds a resource tree: parent base + relative child paths.
 *
 * @example
 * resource("/api/habits", {
 *   LIST: { method: "GET", path: "" },
 *   DETAIL: (id) => ({ method: "GET", path: `/${id}` }),
 *   ADD_NOTE: (id) => ({ method: "POST", path: `/${id}/notes` }),
 * })
 */
function resource<T extends RouteChildren>(
  base: string,
  children: T,
): ResolvedRoutes<T> {
  const resolved = { base } as ResolvedRoutes<T>;

  (Object.keys(children) as Array<keyof T>).forEach((key) => {
    const child = children[key];

    if (typeof child === "function") {
      const factory = child as (...args: string[]) => RelativeRoute;
      (resolved as Record<string, unknown>)[key as string] = (
        ...args: string[]
      ) => {
        const def = factory(...args);
        return {
          method: def.method,
          path: joinPath(base, def.path),
        } satisfies ApiRoute;
      };
      return;
    }

    (resolved as Record<string, unknown>)[key as string] = {
      method: child.method,
      path: joinPath(base, child.path),
    } satisfies ApiRoute;
  });

  return resolved;
}

/**
 * Backend endpoints the frontend calls.
 * Parents own the base path; children only declare the relative segment.
 */
export const routes = {
  DASHBOARD: resource("/api/dashboard", {
    SUMMARY: { method: "GET", path: "" },
  }),

  HABITS: resource("/api/habits", {
    LIST: { method: "GET", path: "" },
    CREATE: { method: "POST", path: "" },
    DETAIL: (id: string) => ({ method: "GET", path: `/${id}` }),
    CHECK_IN: (id: string) => ({ method: "POST", path: `/${id}/check-in` }),
    ADD_NOTE: (id: string) => ({ method: "POST", path: `/${id}/notes` }),
  }),

  CHECK_INS: resource("/api/check-ins", {
    LIST: { method: "GET", path: "" },
  }),

  ONBOARDING: resource("/api/onboarding", {
    STATUS: { method: "GET", path: "/status" },
    COMPLETE: { method: "POST", path: "/complete" },
  }),

  DEMO: resource("/api/demo", {
    RESET: { method: "POST", path: "/reset" },
  }),
} as const;
