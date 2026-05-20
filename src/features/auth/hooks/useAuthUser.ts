"use client";

import { getSessionAuthFromToken } from "@/lib/auth/session";
import type { AuthUser } from "@/types/auth";
import { useAppSelector } from "@/store/hooks";

/** Current user from Redux, with id/role restored from JWT after reload. */
export function useAuthUser(): AuthUser | null {
  const user = useAppSelector((state) => state.auth.user);
  const fromToken = getSessionAuthFromToken();

  if (!user?.id) {
    return fromToken ? { id: fromToken.id, role: fromToken.role } : null;
  }

  return {
    ...user,
    role: user.role ?? fromToken?.role,
  };
}
