export type MockRequestContext = {
  params: Record<string, string>;
  body?: unknown;
  searchParams: URLSearchParams;
};

export type MockHandler = (ctx: MockRequestContext) => unknown;

export type MockRoute = {
  method: string;
  pattern: string;
  handler: MockHandler;
};

function patternToRegex(pattern: string) {
  const parts = pattern.split("/").map((segment) => {
    if (segment.startsWith(":")) {
      return `(?<${segment.slice(1)}>[^/]+)`;
    }
    return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });

  return new RegExp(`^${parts.join("/")}$`);
}

export function matchMockRoute(
  routes: MockRoute[],
  method: string,
  path: string,
): { handler: MockHandler; params: Record<string, string> } | null {
  const normalizedMethod = method.toUpperCase();
  const pathname = path.split("?")[0] ?? path;

  for (const route of routes) {
    if (route.method.toUpperCase() !== normalizedMethod) {
      continue;
    }

    const regex = patternToRegex(route.pattern);
    const match = pathname.match(regex);

    if (!match) {
      continue;
    }

    return {
      handler: route.handler,
      params: { ...(match.groups ?? {}) },
    };
  }

  return null;
}
