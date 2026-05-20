"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ClinicStatusBadge({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) {
  const t = useTranslations("clinics");

  return (
    <Badge
      variant="outline"
      className={cn(
        "cursor-default font-medium",
        isActive
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-slate-300/80 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
        className,
      )}
    >
      {isActive ? t("statusActive") : t("statusInactive")}
    </Badge>
  );
}
