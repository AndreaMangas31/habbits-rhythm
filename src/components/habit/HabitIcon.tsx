import { createElement } from "react";
import { getHabitIcon } from "@/lib/icons/habit-icons";
import { cn } from "@/lib/utils/cn";

type HabitIconProps = {
  name: string;
  className?: string;
  stroke?: number;
};

/** Stable wrapper so icon lookup does not create components during render. */
export function HabitIcon({ name, className, stroke = 1.8 }: HabitIconProps) {
  return createElement(getHabitIcon(name), {
    className: cn(className),
    stroke,
  });
}
