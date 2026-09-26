"use client";

import { useRouter } from "next/navigation";
import { userMock } from "@/features/onboarding/mock";
import { Button, Card } from "@/components/ui";
import { fetchJSON } from "@/lib/http/fetch-json";
import { routes } from "@/shared/routes";

export default function SettingsPage() {
  const router = useRouter();

  async function handleResetDemo() {
    await fetchJSON(routes.DEMO.RESET);
    router.push("/onboarding");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-semibold">Ajustes</h2>
        <p className="text-sm text-muted">
          Preferencias locales del demo (sin backend).
        </p>
      </div>

      <Card padding="lg" className="border border-foreground/5 shadow-card">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-base font-semibold text-primary">
            {userMock.avatarInitials}
          </span>
          <div>
            <p className="font-semibold">
              {userMock.firstName} {userMock.lastName}
            </p>
            <p className="text-sm text-muted">{userMock.email}</p>
          </div>
        </div>
      </Card>

      <Card
        padding="lg"
        className="space-y-3 border border-foreground/5 shadow-card"
      >
        <h3 className="font-semibold">Datos mock</h3>
        <p className="text-sm text-muted">
          Reinicia el onboarding y vuelve a generar el historial local de
          hábitos, check-ins y notas.
        </p>
        <Button
          variant="warning"
          className="rounded-xl"
          onClick={() => {
            void handleResetDemo();
          }}
        >
          Reiniciar demo
        </Button>
      </Card>
    </div>
  );
}
