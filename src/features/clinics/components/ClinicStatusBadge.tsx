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
          ? "border-[var(--design-success)]/30 bg-[var(--design-success)]/10 text-[var(--design-success)]"
          : "border-[var(--design-hairline)] bg-[var(--design-surface-soft)] text-[var(--design-muted)]",
        className,
      )}
    >
      {isActive ? t("statusActive") : t("statusInactive")}
    </Badge>
  );
}
