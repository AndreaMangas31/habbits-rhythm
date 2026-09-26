"use client";

import { IconCheck } from "@tabler/icons-react";
import type { HabitSuggestionMock } from "@/features/habits/mock";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import { HABIT_COLOR_STYLES } from "@/components/onboarding/color-map";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

type ConfirmationStepProps = {
  habits: HabitSuggestionMock[];
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
            ¡Genial! Estos son tus hábitos
          </h2>
          <p className="mt-2 text-sm text-muted sm:text-base">
            Siempre puedes editarlos más tarde.
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
                    {habit.name}
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
          Ir a mi dashboard ✨
        </Button>
      </div>
    </section>
  );
}
