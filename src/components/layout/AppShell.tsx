"use client";

import { SkipToMain } from "@/components/a11y/SkipToMain";
import { AppNavbar } from "./AppNavbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[var(--design-canvas)] text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <SkipToMain />
      <AppNavbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        {children}
      </main>
    </div>
  );
}
