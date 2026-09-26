"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  IconArrowLeft,
  IconCheck,
  IconFlame,
} from "@tabler/icons-react";
import { useState } from "react";
import { MonthCalendar } from "@/components/calendar";
import { TrendChart } from "@/components/charts";
import { Button, Card, Skeleton } from "@/components/ui";
import { HABIT_COLOR_STYLES } from "@/components/onboarding/color-map";
import { HabitIcon } from "@/components/habit";
import { useHabitDetail } from "@/features/habit-detail/useHabitDetail";
import { categoryFromHabit } from "@/lib/utils/habit-stats";
import { cn } from "@/lib/utils/cn";

type HabitDetailViewProps = {
  habitId: string;
};

type MobileTab = "resumen" | "estadisticas" | "notas";

export function HabitDetailView({ habitId }: HabitDetailViewProps) {
  const { data, loading, error, checkIn, saveNote, toggling, savingNote } =
    useHabitDetail(habitId);
  const [tab, setTab] = useState<MobileTab>("resumen");
  const [noteDraft, setNoteDraft] = useState("");

  if (loading && !data) {
    return (
      <div className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-muted">{error ?? "Hábito no encontrado"}</p>
        <Link href="/dashboard" className="mt-4 inline-block text-primary">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  const { habit, stats, checkIns, notes, trend, completedToday } = data;
  const color = HABIT_COLOR_STYLES[habit.color];

  async function handleSaveNote() {
    await saveNote(noteDraft);
    setNoteDraft("");
  }

  const statsGrid = (
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Racha actual", value: stats.currentStreak },
        { label: "Mejor racha", value: stats.bestStreak },
        { label: "Días completados", value: `${stats.completionRate}%` },
        { label: "Total (este mes)", value: stats.monthTotal },
      ].map((item) => (
        <Card
          key={item.label}
          className="border border-foreground/5 text-center shadow-sm"
        >
          <p className="font-stat text-2xl font-bold text-foreground">
            {item.value}
          </p>
          <p className="mt-1 text-xs text-muted">{item.label}</p>
        </Card>
      ))}
    </div>
  );

  const calendarBlock = (
    <Card padding="lg" className="border border-foreground/5 shadow-card">
      <h3 className="mb-4 text-lg font-semibold">Calendario</h3>
      <MonthCalendar checkIns={checkIns} />
    </Card>
  );

  const evolutionBlock = (
    <Card padding="lg" className="border border-foreground/5 shadow-card">
      <h3 className="mb-1 text-lg font-semibold">Evolución</h3>
      <p className="mb-3 text-sm text-muted">Últimos 30 días</p>
      <TrendChart data={trend} />
    </Card>
  );

  const notesBlock = (
    <Card padding="lg" className="border border-foreground/5 shadow-card">
      <h3 className="mb-4 text-lg font-semibold">Notas</h3>
      <textarea
        value={noteDraft}
        onChange={(event) => setNoteDraft(event.target.value)}
        placeholder="Escribe una reflexión sobre este hábito..."
        className="min-h-24 w-full rounded-2xl border border-foreground/10 bg-surface px-4 py-3 text-sm outline-none ring-primary/30 placeholder:text-muted focus:ring-2"
      />
      <Button
        className="mt-3 rounded-xl"
        disabled={!noteDraft.trim() || savingNote}
        onClick={() => {
          void handleSaveNote();
        }}
      >
        {savingNote ? "Guardando..." : "Guardar"}
      </Button>

      <ul className="mt-5 space-y-3">
        {notes.length === 0 ? (
          <li className="text-sm text-muted">Aún no hay notas.</li>
        ) : (
          notes.map((note) => (
            <li
              key={note.id}
              className="rounded-2xl border border-foreground/6 bg-surface-hover/50 px-4 py-3"
            >
              <p className="text-xs font-medium text-muted">
                {format(parseISO(note.date), "d MMM yyyy", { locale: es })}
              </p>
              <p className="mt-1 text-sm text-foreground">{note.content}</p>
            </li>
          ))
        )}
      </ul>
    </Card>
  );

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Link
            href="/dashboard"
            aria-label="Volver"
            className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/8 bg-surface text-muted hover:text-foreground"
          >
            <IconArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                  color.tintBg,
                )}
              >
                <HabitIcon name={habit.icon} className={cn("h-5 w-5", color.icon)} />
              </span>
              <div>
                <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
                  {habit.name}
                </h1>
                <p className="text-sm text-muted">{categoryFromHabit(habit)}</p>
              </div>
            </div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-warning">
              <IconFlame className="h-4 w-4" />
              <span className="font-stat">{stats.currentStreak} días de racha</span>
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="rounded-2xl"
          variant={completedToday ? "success" : "primary"}
          disabled={toggling}
          onClick={() => {
            void checkIn();
          }}
        >
          {completedToday ? (
            <>
              <IconCheck className="mr-2 h-4 w-4" />
              Completado
            </>
          ) : (
            "Check-in"
          )}
        </Button>
      </div>

      <div className="mb-4 flex gap-2 md:hidden">
        {(
          [
            ["resumen", "Resumen"],
            ["estadisticas", "Estadísticas"],
            ["notas", "Notas"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium",
              tab === id
                ? "bg-primary text-white"
                : "bg-surface text-muted border border-foreground/8",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="hidden gap-5 md:grid md:grid-cols-2">
        <div className="space-y-5">
          {calendarBlock}
          {notesBlock}
        </div>
        <div className="space-y-5">
          {statsGrid}
          {evolutionBlock}
        </div>
      </div>

      <div className="space-y-5 md:hidden">
        {tab === "resumen" ? calendarBlock : null}
        {tab === "estadisticas" ? (
          <>
            {statsGrid}
            {evolutionBlock}
          </>
        ) : null}
        {tab === "notas" ? notesBlock : null}
      </div>
    </div>
  );
}
