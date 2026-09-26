"use client";

import { IconCheck } from "@tabler/icons-react";
import type { HabitSuggestion } from "@/lib/mock-data/habits";
import { OnboardingProgress } from "@/features/onboarding/OnboardingProgress";
import { HABIT_COLOR_STYLES } from "@/features/onboarding/color-map";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils/cn";
import { Translate } from "@/shared/layout/AppTranslate";

type ConfirmationStepProps = {
  habits: HabitSuggestion[];
  onFinish: () => void;
  isFinishing: boolean;
};

export function ConfirmationStep({
  habits,
  onFinish,
  isFinishing,
}: ConfirmationStepProps) {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-4xl items-center px-4 py-6 sm:px-6">
      <div className="w-full rounded-[24px] bg-surface px-5 py-6 shadow-card sm:px-8 sm:py-8">
        <OnboardingProgress step={3} totalSteps={3} percent={100} />

        <header className="mt-6 text-center">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            <Translate fallback="…">¡Genial! Estos son tus hábitos</Translate>
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            <Translate fallback="…">
              Siempre puedes editarlos más tarde.
            </Translate>
          </p>
        </header>

        <div className="mt-6 space-y-3">
          {habits.map((habit) => {
            const Icon = habit.icon;
            const color = HABIT_COLOR_STYLES[habit.color];

            return (
              <div
                key={habit.id}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3",
                  color.tintBg,
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-5 w-5", color.icon)} stroke={1.9} />
                  <span className="font-medium text-foreground">
                    <Translate fallback="…">{habit.name}</Translate>
                  </span>
                </div>
                <span
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success text-white"
                  aria-hidden="true"
                >
                  <IconCheck className="h-3.5 w-3.5" stroke={2.5} />
                </span>
              </div>
            );
          })}
        </div>

        <Button
          variant="success"
          size="lg"
          className="mt-7 h-12 w-full rounded-2xl text-base"
          onClick={onFinish}
          disabled={isFinishing}
        >
          <Translate fallback="…">Ir a mi panel ✨</Translate>
        </Button>
      </div>
    </section>
  );
}
