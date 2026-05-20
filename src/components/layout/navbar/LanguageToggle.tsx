"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "EN",
  ar: "AR",
};

export function LanguageToggle({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (next: AppLocale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-background/50 p-0.5",
        className,
      )}
    >
      {routing.locales.map((loc) => {
        const active = locale === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            aria-pressed={active}
            aria-label={t("switchTo", { locale: LOCALE_LABELS[loc] })}
            className={cn(
              "cursor-pointer rounded-md px-2.5 py-1 text-xs font-semibold tracking-wide uppercase transition-colors",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-popover-foreground",
            )}
          >
            {LOCALE_LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}
