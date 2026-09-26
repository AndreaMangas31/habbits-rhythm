"use client";

import { HabitDetailView } from "@/features/habit-detail";
import { use } from "react";

type HabitDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function HabitDetailPage({ params }: HabitDetailPageProps) {
  const { id } = use(params);
  return <HabitDetailView habitId={id} />;
}
