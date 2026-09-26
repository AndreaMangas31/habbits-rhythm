"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconChartBar,
  IconHome2,
  IconListCheck,
  IconPlus,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/dashboard", label: "Inicio", icon: IconHome2 },
  { href: "/habits", label: "Hábitos", icon: IconListCheck },
  { href: "/habits/new", label: "Añadir", icon: IconPlus, primary: true },
  { href: "/stats", label: "Stats", icon: IconChartBar },
  { href: "/settings", label: "Ajustes", icon: IconSettings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-foreground/8 bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="mx-auto flex h-16 max-w-lg items-end justify-between">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/habits/new" &&
              pathname.startsWith(`${item.href}/`));

          if ("primary" in item && item.primary) {
            return (
              <li key={item.href} className="relative -top-3 flex flex-1 justify-center">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30"
                >
                  <Icon className="h-6 w-6" stroke={2.2} />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex flex-1 justify-center">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2 text-[11px] font-medium",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="h-5 w-5" stroke={1.8} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
