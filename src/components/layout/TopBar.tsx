"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  IconBell,
  IconSearch,
} from "@tabler/icons-react";
import { MOCK_USER } from "@/lib/mock-data/user";

type TopBarProps = {
  title?: string;
};

export function TopBar({ title }: TopBarProps) {
  const todayLabel = format(new Date(), "EEEE, d MMMM", { locale: es });

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/6 bg-background/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">
          {title ?? `Hola, ${MOCK_USER.firstName} 👋`}
        </h1>
        <p className="mt-0.5 text-sm capitalize text-muted">{todayLabel}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Buscar"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/8 bg-surface text-muted hover:text-foreground"
        >
          <IconSearch className="h-4 w-4" stroke={1.8} />
        </button>
        <button
          type="button"
          aria-label="Notificaciones"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/8 bg-surface text-muted hover:text-foreground"
        >
          <IconBell className="h-4 w-4" stroke={1.8} />
        </button>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {MOCK_USER.avatarInitials}
        </span>
      </div>
    </header>
  );
}
