import type { MockRoute } from "@/lib/http/mock-router";
import { addNoteInStore, readHabitDetail } from "@/lib/mock/store";

export const habitDetailMockRoutes: MockRoute[] = [
  {
    method: "GET",
    pattern: "/api/habits/:id/detail",
    handler: ({ params }) => {
      const detail = readHabitDetail(params.id!);
      if (!detail) {
        throw new Error("Hábito no encontrado");
      }
      return detail;
    },
  },
  {
    method: "POST",
    pattern: "/api/habits/:id/notes",
    handler: ({ params, body }) => {
      const content =
        typeof body === "object" &&
        body !== null &&
        "content" in body &&
        typeof (body as { content: unknown }).content === "string"
          ? (body as { content: string }).content
          : "";

      return addNoteInStore(params.id!, content);
    },
  },
];
