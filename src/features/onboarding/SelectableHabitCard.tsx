"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconCheck } from "@tabler/icons-react";
import type { HabitSuggestion } from "@/lib/mock-data/habits";
import { cn } from "@/lib/utils/cn";
import { HABIT_COLOR_STYLES } from "@/features/onboarding/color-map";
import { Translate } from "@/shared/layout/AppTranslate";

type SelectableHabitCardProps = {
  habit: HabitSuggestion;
  selected: boolean;
  onToggle: (habitId: string) => void;
};

export function SelectableHabitCard({
  habit,
  selected,
  onToggle,
}: SelectableHabitCardProps) {
  const Icon = habit.icon;
  const colorStyles = HABIT_COLOR_STYLES[habit.color];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(habit.id)}
      className={cn(
        "group relative flex min-h-28 w-full items-center justify-center rounded-card border bg-surface px-4 py-5 text-center shadow-sm transition-all",
        "hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected
          ? cn(
              "border-primary",
              colorStyles.selectedBg,
              colorStyles.selectedRing,
            )
          : "border-foreground/10",
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Icon className={cn("h-10 w-10", colorStyles.icon)} stroke={1.8} />
        <span className="text-sm font-semibold text-foreground">
          <Translate fallback="…">{habit.name}</Translate>
        </span>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.span
            key="selected-indicator"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
            aria-hidden="true"
          >
            <IconCheck className="h-3.5 w-3.5" stroke={2.4} />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </button>
  );
}
