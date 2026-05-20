"use client";

import { AuthBannerPanel } from "./AuthBannerPanel";
import { AuthFormPanel } from "./AuthFormPanel";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
}

export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row rtl:lg:flex-row-reverse">
      <AuthBannerPanel />
      <AuthFormPanel>{children}</AuthFormPanel>
    </div>
  );
}
