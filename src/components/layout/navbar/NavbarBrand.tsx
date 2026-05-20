"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function NavbarBrand({ className }: { className?: string }) {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <Link
      href="/dashboard"
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-md outline-none transition-opacity hover:opacity-90",
        "focus-visible:ring-2 focus-visible:ring-[var(--design-primary)]/40 focus-visible:ring-offset-2",
        className,
      )}
    >
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--design-primary)] text-sm font-bold text-white shadow-sm"
        aria-hidden
      >
        C
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {t("appName")}
        </span>
        <span className="sr-only"> — {tNav("home")}</span>
      </span>
    </Link>
  );
}
