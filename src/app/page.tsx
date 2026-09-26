"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchJSON } from "@/lib/http/fetch-json";
import { ensureMockRegistry } from "@/lib/http/register-mocks";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    ensureMockRegistry();
    void fetchJSON<{ completed: boolean }>("/api/onboarding/status").then(
      (status) => {
        router.replace(status.completed ? "/dashboard" : "/onboarding");
      },
    );
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background text-muted">
      Cargando Flowhabit...
    </main>
  );
}
