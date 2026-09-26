"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ConfirmationStep,
  HabitSelectionStep,
  WelcomeStep,
} from "@/components/onboarding";
import { useOnboarding } from "@/features/onboarding";

const stepTransition = {
  stiffness: 210,
  damping: 26,
  mass: 0.9,
};

const stepLabels = {
  1: "Paso 1 de 3",
  2: "Paso 2 de 3",
  3: "Paso 3 de 3",
} as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);
  const {
    step,
    selectedHabitIds,
    selectedHabits,
    isSelectionEmpty,
    goToStep,
    toggleHabit,
    completeOnboarding,
  } = useOnboarding();

  const liveRegionText = useMemo(() => stepLabels[step], [step]);

  async function handleFinish() {
    setIsFinishing(true);
    await completeOnboarding();
    await new Promise((resolve) => {
      setTimeout(resolve, 260);
    });
    router.push("/dashboard");
  }

  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {liveRegionText}
      </p>

      <motion.div
        initial={false}
        animate={{ opacity: isFinishing ? 0 : 1 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === 1 ? (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={stepTransition}
            >
              <WelcomeStep onStart={() => goToStep(2)} />
            </motion.div>
          ) : null}

          {step === 2 ? (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={stepTransition}
            >
              <HabitSelectionStep
                selectedHabitIds={selectedHabitIds}
                onToggleHabit={toggleHabit}
                onContinue={() => {
                  if (!isSelectionEmpty) {
                    goToStep(3);
                  }
                }}
              />
            </motion.div>
          ) : null}

          {step === 3 ? (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={stepTransition}
            >
              <ConfirmationStep
                habits={selectedHabits}
                onFinish={handleFinish}
                isFinishing={isFinishing}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
