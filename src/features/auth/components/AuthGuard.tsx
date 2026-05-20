"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import {
  clearAuthCookies,
  getAccessToken,
} from "@/lib/auth/cookies";
import { redirectToLogin } from "@/lib/auth/redirect";
import { isAccessTokenValid } from "@/lib/auth/token";
import { getSessionAuthFromToken } from "@/lib/auth/session";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCredentials, setCredentials } from "@/features/auth/authSlice";
import { Spinner } from "@/components/ui/spinner";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Client guard for protected app shells. Middleware blocks missing/expired
 * tokens first; this catches stale client state when cookies are cleared.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const storedUser = useAppSelector((state) => state.auth.user);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      clearAuthCookies();
      dispatch(clearCredentials());
      redirectToLogin(pathname);
      return;
    }

    if (!isAccessTokenValid(token)) {
      clearAuthCookies();
      dispatch(clearCredentials());
      redirectToLogin(pathname);
      return;
    }

    const session = getSessionAuthFromToken();
    if (session && (!storedUser?.id || (!storedUser.role && session.role))) {
      dispatch(
        setCredentials({
          user: {
            id: storedUser?.id ?? session.id,
            email: storedUser?.email,
            name: storedUser?.name,
            role: storedUser?.role ?? session.role,
          },
        }),
      );
    }

    setAllowed(true);
  }, [dispatch, pathname, storedUser?.id, storedUser?.role, storedUser?.email, storedUser?.name]);

  if (!allowed) {
    return (
      <div
        className="flex min-h-[50vh] flex-1 items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Checking authentication"
      >
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
