"use client";

import { getSessionAuthFromToken } from "@/lib/auth/session";
import { isAdminRole } from "@/lib/auth/roles";
import { useAppSelector } from "@/store/hooks";

/** True when the signed-in user has the `admin` role (Redux or JWT). */
export function useIsAdmin(): boolean {
  const role = useAppSelector((state) => state.auth.user?.role);
  const sessionRole = getSessionAuthFromToken()?.role;
  return isAdminRole(role ?? sessionRole);
}
