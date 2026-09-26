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
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { HabitColorToken } from "@/types/habit";

export type HabitSuggestion = {
  id: string;
  name: string;
  description: string;
  icon: ComponentType<IconProps>;
  iconName: string;
  color: HabitColorToken;
};

export const HABIT_SUGGESTIONS: HabitSuggestion[] = [
  {
    id: "sport",
    name: "Deporte",
    description: "Mover el cuerpo cada dia para sostener energia y enfoque.",
    icon: IconRun,
    iconName: "IconRun",
    color: "habit-8",
  },
  {
    id: "read",
    name: "Leer",
    description: "Reservar tiempo de lectura diaria para aprender y crecer.",
    icon: IconBook,
    iconName: "IconBook",
    color: "habit-1",
  },
  {
    id: "meditation",
    name: "Meditación",
    description: "Respirar y bajar revoluciones durante algunos minutos.",
    icon: IconBrain,
    iconName: "IconBrain",
    color: "habit-5",
  },
  {
    id: "drink-water",
    name: "Beber agua",
    description: "Mantener hidratacion estable durante el dia.",
    icon: IconBottle,
    iconName: "IconBottle",
    color: "habit-3",
  },
  {
    id: "sleep-better",
    name: "Dormir mejor",
    description: "Construir una rutina nocturna de descanso reparador.",
    icon: IconMoon,
    iconName: "IconMoon",
    color: "habit-2",
  },
  {
    id: "healthy-eating",
    name: "Alimentación saludable",
    description: "Priorizar comidas simples, balanceadas y sostenibles.",
    icon: IconSalad,
    iconName: "IconSalad",
    color: "habit-7",
  },
  {
    id: "writing",
    name: "Escribir",
    description: "Registrar ideas y reflexiones para ganar claridad.",
    icon: IconWriting,
    iconName: "IconWriting",
    color: "habit-4",
  },
  {
    id: "study",
    name: "Estudiar",
    description: "Bloque intencional de estudio sin distracciones.",
    icon: IconSchool,
    iconName: "IconSchool",
    color: "habit-6",
  },
  {
    id: "gratitude",
    name: "Agradecer",
    description: "Cerrar el dia identificando algo por agradecer.",
    icon: IconHeart,
    iconName: "IconHeart",
    color: "habit-1",
  },
];
