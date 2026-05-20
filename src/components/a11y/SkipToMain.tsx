"use client";

import { useTranslations } from "next-intl";

export function SkipToMain() {
  const t = useTranslations("nav");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-md focus:ring-2 focus:ring-ring focus:outline-none"
    >
      {t("skipToMain")}
    </a>
  );
}
