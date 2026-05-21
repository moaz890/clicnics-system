"use client";

import { useTranslations } from "next-intl";
import { USER_ROLE_LABEL_KEYS } from "../lib/constants";
import type { UserRole } from "../types/user";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const roleStyles: Record<UserRole, string> = {
  admin:
    "border-primary/30 bg-primary/10 text-primary",
  doctor:
    "border-[var(--design-accent-teal)]/30 bg-[var(--design-accent-teal)]/10 text-[var(--design-accent-teal)]",
  reception:
    "border-[var(--design-accent-amber)]/30 bg-[var(--design-accent-amber)]/10 text-[var(--design-accent-amber)]",
  patient:
    "border-[var(--design-hairline)] bg-[var(--design-surface-soft)] text-[var(--design-muted)]",
};

export function UserRoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  const t = useTranslations("users");

  return (
    <Badge
      variant="outline"
      className={cn("cursor-default font-medium", roleStyles[role], className)}
    >
      {t(USER_ROLE_LABEL_KEYS[role])}
    </Badge>
  );
}
