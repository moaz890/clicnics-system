import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "@/types/auth";
import { AUTH_COOKIE_NAMES, getAccessToken } from "./cookies";
import { normalizeRole } from "./roles";
import { isAccessTokenValid } from "./token";

interface AccessTokenIdentity {
  id?: string;
  userId?: string;
  sub?: string;
  _id?: string;
  role?: string;
}

function readUserIdFromClaims(claims: AccessTokenIdentity): string {
  const id = claims.id ?? claims.userId ?? claims._id ?? claims.sub;
  return typeof id === "string" ? id : id != null ? String(id) : "";
}

export function getAccessTokenFromRequest(
  getCookie: (name: string) => { value: string } | undefined,
): string | undefined {
  return getCookie(AUTH_COOKIE_NAMES.accessToken)?.value;
}

export function isRequestAuthenticated(
  getCookie: (name: string) => { value: string } | undefined,
): boolean {
  return isAccessTokenValid(getAccessTokenFromRequest(getCookie));
}

/** Redux user id, falling back to JWT claims when the store was cleared on reload. */
export function getSessionUserId(reduxUserId?: string | null): string {
  if (reduxUserId?.trim()) {
    return reduxUserId.trim();
  }

  const token = getAccessToken();
  if (!token) {
    return "";
  }

  try {
    return readUserIdFromClaims(jwtDecode<AccessTokenIdentity>(token));
  } catch {
    return "";
  }
}

/** User id + role from JWT (survives page reload when Redux is empty). */
export function getSessionAuthFromToken(): Pick<AuthUser, "id" | "role"> | null {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  try {
    const claims = jwtDecode<AccessTokenIdentity>(token);
    const id = readUserIdFromClaims(claims);
    if (!id) {
      return null;
    }

    const role = normalizeRole(claims.role);
    return { id, ...(role ? { role } : {}) };
  } catch {
    return null;
  }
}
