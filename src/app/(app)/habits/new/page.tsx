"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { habitsMock } from "@/features/habits/mock";
import { useHabits } from "@/features/habits";
import { Button, Card } from "@/components/ui";
import { HABIT_COLOR_STYLES } from "@/components/onboarding/color-map";
import { cn } from "@/lib/utils/cn";

export default function NewHabitPage() {
  const router = useRouter();
  const { createHabit } = useHabits();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    const suggestion = habitsMock.find((item) => item.id === selectedId);
    if (!suggestion) return;

    setSaving(true);
    const habit = await createHabit({
      name: suggestion.name,
      description: suggestion.description,
      icon: suggestion.iconName,
      color: suggestion.color,
      frequency: "daily",
      goal: { target: 1, period: "day", unit: "sesión" },
    });
    router.push(`/habits/${habit.id}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-xl font-semibold">Añadir hábito</h2>
        <p className="text-sm text-muted">
          Elige una sugerencia para sumarla a tu rutina (mock, sin backend).
        </p>
      </div>

      <Card
        padding="lg"
        className="grid gap-3 border border-foreground/5 sm:grid-cols-2"
      >
        {habitsMock.map((habit) => {
          const Icon = habit.icon;
          const color = HABIT_COLOR_STYLES[habit.color];
          const selected = selectedId === habit.id;

          return (
            <button
              key={habit.id}
              type="button"
              onClick={() => setSelectedId(habit.id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-foreground/8 hover:border-foreground/20",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                  color.tintBg,
                )}
              >
                <Icon className={cn("h-5 w-5", color.icon)} />
              </span>
              <span>
                <span className="block font-medium">{habit.name}</span>
                <span className="block text-xs text-muted">
                  {habit.description}
                </span>
              </span>
            </button>
          );
        })}
      </Card>

      <Button
        size="lg"
        className="w-full rounded-2xl sm:w-auto"
        disabled={!selectedId || saving}
        onClick={() => {
          void handleCreate();
        }}
      >
        {saving ? "Creando..." : "Crear hábito"}
      </Button>
    </div>
  );
}
