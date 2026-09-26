import {
  IconBook,
  IconBottle,
  IconBrain,
  IconHeart,
  IconMoon,
  IconRun,
  IconSalad,
  IconSchool,
  IconWriting,
  type IconProps,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

export const HABIT_ICON_MAP: Record<string, ComponentType<IconProps>> = {
  IconRun,
  IconBook,
  IconBrain,
  IconBottle,
  IconMoon,
  IconSalad,
  IconWriting,
  IconSchool,
  IconHeart,
};

export function getHabitIcon(iconName: string): ComponentType<IconProps> {
  return HABIT_ICON_MAP[iconName] ?? IconHeart;
}
