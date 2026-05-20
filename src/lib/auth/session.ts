import { AUTH_COOKIE_NAMES } from "./cookies";
import { isAccessTokenValid } from "./token";

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
