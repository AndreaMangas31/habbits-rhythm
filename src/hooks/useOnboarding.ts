"use client";

import { useMemo, useState } from "react";
import {
  ONBOARDING_STORAGE_KEYS,
  resetMockData,
} from "@/lib/api/habits";
import { HABIT_SUGGESTIONS } from "@/lib/mock-data/habits";
import { setStorageItem } from "@/lib/storage";

export { ONBOARDING_STORAGE_KEYS };

export type OnboardingStep = 1 | 2 | 3;

export function useOnboarding() {
  const [step, setStep] = useState<OnboardingStep>(1);
  const [selectedHabitIds, setSelectedHabitIds] = useState<string[]>([]);

  const selectedHabits = useMemo(
    () =>
      HABIT_SUGGESTIONS.filter((habit) => selectedHabitIds.includes(habit.id)),
    [selectedHabitIds],
  );

  function goToStep(nextStep: OnboardingStep) {
    setStep(nextStep);
  }

  function nextStep() {
    setStep((prev) => (prev < 3 ? ((prev + 1) as OnboardingStep) : prev));
  }

  function previousStep() {
    setStep((prev) => (prev > 1 ? ((prev - 1) as OnboardingStep) : prev));
  }

  function toggleHabit(habitId: string) {
    setSelectedHabitIds((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId],
    );
  }

  function completeOnboarding() {
    const now = new Date().toISOString();
    setStorageItem(ONBOARDING_STORAGE_KEYS.selectedHabitIds, selectedHabitIds);
    setStorageItem(ONBOARDING_STORAGE_KEYS.completedAt, now);
    // Re-seed mock data filtered to the habits chosen during onboarding.
    resetMockData();
  }

  return {
    step,
    selectedHabitIds,
    selectedHabits,
    isSelectionEmpty: selectedHabitIds.length === 0,
    goToStep,
    nextStep,
    previousStep,
    toggleHabit,
    completeOnboarding,
  };
}
