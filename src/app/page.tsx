"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboardingCompleted } from "@/lib/api/habits";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isOnboardingCompleted()) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/onboarding");
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background text-muted">
      Cargando Flowhabit...
    </main>
  );
}
