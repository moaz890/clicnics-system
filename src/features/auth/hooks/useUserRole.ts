"use client";

import { getSessionAuthFromToken } from "@/lib/auth/session";
import { normalizeRole } from "@/lib/auth/roles";
import { useAppSelector } from "@/store/hooks";

/** Current user role from Redux or JWT (survives reload). */
export function useUserRole(): string | undefined {
  const role = useAppSelector((state) => state.auth.user?.role);
  const sessionRole = getSessionAuthFromToken()?.role;
  return normalizeRole(role ?? sessionRole);
}
