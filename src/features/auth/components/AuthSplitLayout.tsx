"use client";

import { AuthFormPanel } from "./AuthFormPanel";
import { AuthHeroPanel } from "./AuthHeroPanel";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:min-h-dvh lg:flex-row rtl:lg:flex-row-reverse">
      <AuthHeroPanel />
      <AuthFormPanel>{children}</AuthFormPanel>
    </div>
  );
}
