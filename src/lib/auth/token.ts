import { jwtDecode } from "jwt-decode";

interface AccessTokenPayload {
  exp?: number;
}

const CLOCK_SKEW_MS = 10_000;

/**
 * Route-guard check (does not verify signature).
 * Non-JWT opaque tokens are treated as valid if present; API validates them.
 */
export function isAccessTokenValid(token: string | undefined | null): boolean {
  if (!token?.trim()) {
    return false;
  }

  try {
    const { exp } = jwtDecode<AccessTokenPayload>(token);
    if (typeof exp !== "number") {
      return true;
    }
    return exp * 1000 > Date.now() - CLOCK_SKEW_MS;
  } catch {
    return token.trim().length >= 8;
  }
}
