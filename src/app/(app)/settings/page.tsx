"use client";

import { useRouter } from "next/navigation";
import { MOCK_USER } from "@/lib/mock-data/user";
import { Button, Card } from "@/components/ui";
import {
  ONBOARDING_STORAGE_KEYS,
  resetMockData,
} from "@/lib/api/habits";
import { STORAGE_KEYS, removeStorageItem, setStorageItem } from "@/lib/storage";

export default function SettingsPage() {
  const router = useRouter();

  function handleResetDemo() {
    removeStorageItem(ONBOARDING_STORAGE_KEYS.completedAt);
    removeStorageItem(ONBOARDING_STORAGE_KEYS.selectedHabitIds);
    setStorageItem(STORAGE_KEYS.initialized, false);
    resetMockData();
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
            {MOCK_USER.avatarInitials}
          </span>
          <div>
            <p className="font-semibold">
              {MOCK_USER.firstName} {MOCK_USER.lastName}
            </p>
            <p className="text-sm text-muted">{MOCK_USER.email}</p>
          </div>
        </div>
      </Card>

      <Card padding="lg" className="space-y-3 border border-foreground/5 shadow-card">
        <h3 className="font-semibold">Datos mock</h3>
        <p className="text-sm text-muted">
          Reinicia el onboarding y vuelve a generar el historial local de
          hábitos, check-ins y notas.
        </p>
        <Button variant="warning" className="rounded-xl" onClick={handleResetDemo}>
          Reiniciar demo
        </Button>
      </Card>
    </div>
  );
}
