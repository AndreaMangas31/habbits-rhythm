"use client";

import { cn } from "@/lib/utils/cn";
import type { HeatmapDay } from "@/types/dashboard";

type ConsistencyHeatmapProps = {
  days: HeatmapDay[];
  className?: string;
};

const levelClasses = [
  "bg-success/10",
  "bg-success/25",
  "bg-success/45",
  "bg-success/70",
  "bg-success",
] as const;

export function ConsistencyHeatmap({ days, className }: ConsistencyHeatmapProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-1.5">
        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} hábitos`}
            className={cn(
              "h-3.5 w-3.5 rounded-sm sm:h-4 sm:w-4",
              levelClasses[day.level] ?? levelClasses[0],
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-1.5 text-xs text-muted">
        <span>Menos</span>
        {levelClasses.map((levelClass, index) => (
          <span
            key={levelClass}
            className={cn("h-2.5 w-2.5 rounded-sm", levelClass)}
            aria-hidden={index > 0}
          />
        ))}
        <span>Más</span>
      </div>
    </div>
  );
}
