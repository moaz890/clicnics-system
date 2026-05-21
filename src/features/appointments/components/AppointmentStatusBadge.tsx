"use client";

import { useTranslations } from "next-intl";
import type { AppointmentStatus } from "../types/appointment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<AppointmentStatus, string> = {
  scheduled:
    "border-[var(--design-accent-teal)]/30 bg-[var(--design-accent-teal)]/10 text-[var(--design-accent-teal)]",
  completed:
    "border-[var(--design-success)]/30 bg-[var(--design-success)]/10 text-[var(--design-success)]",
  cancelled:
    "border-[var(--design-hairline)] bg-[var(--design-surface-soft)] text-[var(--design-muted)] line-through",
};

export function AppointmentStatusBadge({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  const t = useTranslations("appointments");

  return (
    <Badge
      variant="outline"
      className={cn("cursor-default font-medium", statusStyles[status], className)}
    >
      {t(`status_${status}`)}
    </Badge>
  );
}
