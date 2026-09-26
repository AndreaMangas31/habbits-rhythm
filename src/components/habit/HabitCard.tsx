"use client";

import Link from "next/link";
import { IconFlame } from "@tabler/icons-react";
import { StatusIcon } from "@/components/habit/StatusIcon";
import { getHabitIcon } from "@/lib/icons/habit-icons";
import { HABIT_COLOR_STYLES } from "@/components/onboarding/color-map";
import { cn } from "@/lib/utils/cn";
import type { Habit } from "@/types/habit";

type HabitCardProps = {
  habit: Habit;
  completedToday: boolean;
  streak: number;
  onToggle?: () => void;
  href?: string;
  className?: string;
};

export function HabitCard({
  habit,
  completedToday,
  streak,
  onToggle,
  href,
  className,
}: HabitCardProps) {
  const Icon = getHabitIcon(habit.icon);
  const color = HABIT_COLOR_STYLES[habit.color];

  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            color.tintBg,
          )}
        >
          <Icon className={cn("h-5 w-5", color.icon)} stroke={1.8} />
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{habit.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <IconFlame className="h-3.5 w-3.5 text-warning" stroke={2} />
            <span className="font-stat">{streak} días</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={cn(
            "hidden text-xs font-medium sm:inline",
            completedToday ? "text-success" : "text-muted",
          )}
        >
          {completedToday ? "Completado" : "Pendiente"}
        </span>
        <button
          type="button"
          aria-label={
            completedToday
              ? `Marcar ${habit.name} como pendiente`
              : `Completar ${habit.name}`
          }
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggle?.();
          }}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <StatusIcon status={completedToday ? "completed" : "pending"} />
        </button>
      </div>
    </>
  );

  const classes = cn(
    "flex w-full items-center justify-between gap-3 rounded-2xl border border-foreground/6 bg-surface px-4 py-3 transition-shadow hover:shadow-md",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
