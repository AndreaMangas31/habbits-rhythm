"use client";

import { IconArrowRight } from "@tabler/icons-react";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { SelectableHabitCard } from "@/components/onboarding/SelectableHabitCard";
import { Button } from "@/components/ui";
import { HABIT_SUGGESTIONS } from "@/lib/mock-data/habits";

type HabitSelectionStepProps = {
  selectedHabitIds: string[];
  onToggleHabit: (habitId: string) => void;
  onContinue: () => void;
};

export function HabitSelectionStep({
  selectedHabitIds,
  onToggleHabit,
  onContinue,
}: HabitSelectionStepProps) {
  const selectedCount = selectedHabitIds.length;
  const canContinue = selectedCount > 0;

  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-8 lg:py-10">
      <div className="rounded-[24px] bg-surface px-5 py-5 shadow-card sm:px-7 sm:py-7">
        <OnboardingProgress step={2} totalSteps={3} percent={66} />

        <header className="mt-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Que habitos quieres construir?
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Selecciona los que mas te importan para iniciar tu rutina.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-3 pb-28 sm:grid-cols-2 lg:grid-cols-3">
          {HABIT_SUGGESTIONS.map((habit) => (
            <SelectableHabitCard
              key={habit.id}
              habit={habit}
              selected={selectedHabitIds.includes(habit.id)}
              onToggle={onToggleHabit}
            />
          ))}
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-foreground/10 bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
          <p className="text-sm font-medium text-success font-stat">
            {selectedCount} seleccionados
          </p>
          <Button
            size="lg"
            className="h-11 rounded-2xl px-5"
            onClick={onContinue}
            disabled={!canContinue}
            aria-disabled={!canContinue}
          >
            Continuar
            <IconArrowRight className="ml-2 h-4 w-4" stroke={2.2} />
          </Button>
        </div>
      </footer>
    </section>
  );
}
