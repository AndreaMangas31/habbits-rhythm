import { createTranslationSessionHandler } from "@languager-ai/sdk/next/server";

/** Keeps the create-capable key on the server and returns brief session tokens. */
export const POST = createTranslationSessionHandler({
  // Must point to the same API that the browser uses for /translations.
  // The public URL is a safe fallback for local development; production can
  // keep the server configuration separate with LANGUAGER_BASE_URL.
  baseUrl:
    process.env.LANGUAGER_BASE_URL ??
    process.env.NEXT_PUBLIC_LANGUAGER_API_URL,
  maxChars: 10_000,
  maxRequests: 100,
  ttlMinutes: 10,
});
