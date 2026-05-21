"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function UserStatusBadge({
  isBlocked,
  className,
}: {
  isBlocked: boolean;
  className?: string;
}) {
  const t = useTranslations("users");

  return (
    <Badge
      variant="outline"
      className={cn(
        "cursor-default font-medium",
        isBlocked
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-[var(--design-success)]/30 bg-[var(--design-success)]/10 text-[var(--design-success)]",
        className,
      )}
    >
      {isBlocked ? t("statusBlocked") : t("statusActive")}
    </Badge>
  );
}
