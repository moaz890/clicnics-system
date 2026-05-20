import { jwtDecode } from "jwt-decode";
import { AUTH_COOKIE_NAMES, getAccessToken } from "./cookies";
import { isAccessTokenValid } from "./token";

interface AccessTokenIdentity {
  id?: string;
  userId?: string;
  sub?: string;
  _id?: string;
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
    const claims = jwtDecode<AccessTokenIdentity>(token);
    const id = claims.id ?? claims.userId ?? claims._id ?? claims.sub;
    return typeof id === "string" ? id : id != null ? String(id) : "";
  } catch {
    return "";
  }
}
