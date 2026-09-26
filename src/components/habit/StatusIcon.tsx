"use client";

import {
  IconCheck,
  IconFlame,
  IconMinus,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils/cn";

export type HabitDayStatus =
  | "pending"
  | "completed"
  | "streak"
  | "missed"
  | "future";

const statusConfig: Record<
  HabitDayStatus,
  { label: string; className: string; icon: typeof IconCheck }
> = {
  pending: {
    label: "Pendiente",
    className: "border-2 border-warning/70 bg-transparent text-warning",
    icon: IconMinus,
  },
  completed: {
    label: "Completado",
    className: "border-transparent bg-success text-white",
    icon: IconCheck,
  },
  streak: {
    label: "Racha activa",
    className: "border-transparent bg-warning text-white",
    icon: IconFlame,
  },
  missed: {
    label: "No hecho",
    className: "border-transparent bg-muted/40 text-white",
    icon: IconX,
  },
  future: {
    label: "Futuro",
    className: "border border-foreground/10 bg-transparent text-muted/50",
    icon: IconMinus,
  },
};

type StatusIconProps = {
  status: HabitDayStatus;
  size?: "sm" | "md";
  className?: string;
};

export function StatusIcon({
  status,
  size = "md",
  className,
}: StatusIconProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const dimension = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";

  return (
    <span
      title={config.label}
      aria-label={config.label}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        dimension,
        config.className,
        className,
      )}
    >
      {status === "pending" || status === "future" ? null : (
        <Icon className={iconSize} stroke={2.4} />
      )}
    </span>
  );
}
