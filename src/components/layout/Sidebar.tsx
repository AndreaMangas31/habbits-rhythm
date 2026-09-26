"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconCalendar,
  IconChartBar,
  IconChevronLeft,
  IconChevronRight,
  IconHome2,
  IconLeaf,
  IconListCheck,
  IconSettings,
  IconSparkles,
  IconTarget,
} from "@tabler/icons-react";
import { MOCK_USER } from "@/lib/mock-data/user";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: IconHome2 },
  { href: "/habits", label: "Hábitos", icon: IconListCheck },
  { href: "/stats", label: "Estadísticas", icon: IconChartBar },
  { href: "/goals", label: "Objetivos", icon: IconTarget },
  { href: "/calendar", label: "Calendario", icon: IconCalendar },
  { href: "/insights", label: "Insights", icon: IconSparkles },
  { href: "/settings", label: "Ajustes", icon: IconSettings },
] as const;

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-foreground/8 bg-[#1a1a2e] text-white transition-[width] duration-200 md:flex",
        collapsed ? "w-[76px]" : "w-[240px]",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center gap-2 px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <IconLeaf className="h-5 w-5" stroke={2} />
          </span>
          {!collapsed ? <span>Flowhabit</span> : null}
        </Link>
        {!collapsed ? (
          <button
            type="button"
            aria-label="Colapsar menú"
            onClick={onToggle}
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {collapsed ? (
        <button
          type="button"
          aria-label="Expandir menú"
          onClick={onToggle}
          className="mx-auto mb-2 rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <IconChevronRight className="h-4 w-4" />
        </button>
      ) : null}

      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                active
                  ? "bg-primary text-white"
                  : "text-white/70 hover:bg-white/8 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" stroke={1.8} />
              {!collapsed ? <span>{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 hover:bg-white/8",
            collapsed && "justify-center",
          )}
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/25 text-sm font-semibold">
            {MOCK_USER.avatarInitials}
          </span>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {MOCK_USER.firstName} {MOCK_USER.lastName}
              </p>
              <p className="text-xs text-white/50">Ver perfil</p>
            </div>
          ) : null}
        </Link>
      </div>
    </aside>
  );
}
