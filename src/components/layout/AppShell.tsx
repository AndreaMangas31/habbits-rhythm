"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

type AppShellProps = {
  children: React.ReactNode;
  title?: string;
};

export function AppShell({ children, title }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const hideTopBar =
    pathname.startsWith("/habits/") && pathname !== "/habits/new";

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {!hideTopBar ? <TopBar title={title} /> : null}
        <div className="flex-1 pb-24 md:pb-6">{children}</div>
        <BottomNav />
      </div>
    </div>
  );
}
