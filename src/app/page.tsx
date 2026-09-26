"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchJSON } from "@/lib/http/fetch-json";
import { routes } from "@/shared/routes";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    void fetchJSON<{ completed: boolean }>(routes.ONBOARDING.STATUS).then(
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
