"use client";

import { AppNavbar } from "./AppNavbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--design-canvas)] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <AppNavbar />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
