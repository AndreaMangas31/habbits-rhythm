"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type OnboardingProgressProps = {
  step: number;
  totalSteps: number;
  percent: number;
  className?: string;
};

export function OnboardingProgress({
  step,
  totalSteps,
  percent,
  className,
}: OnboardingProgressProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm font-medium text-muted">
        <span>Paso {step} de {totalSteps}</span>
        <span className="font-stat">{percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-hover">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 170, damping: 24, mass: 0.8 }}
        />
      </div>
    </div>
  );
}
