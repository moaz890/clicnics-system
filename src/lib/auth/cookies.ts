import Cookies from "js-cookie";

export const AUTH_COOKIE_NAMES = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
} as const;

const isProduction = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_OPTIONS: Cookies.CookieAttributes = {
  path: "/",
  sameSite: "lax",
  secure: isProduction,
};

const ACCESS_TOKEN_MAX_AGE_DAYS = 1;
const REFRESH_TOKEN_MAX_AGE_DAYS = 7;

export function getAccessToken(): string | undefined {
  return Cookies.get(AUTH_COOKIE_NAMES.accessToken);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(AUTH_COOKIE_NAMES.refreshToken);
}

export function setAuthCookies(accessToken: string, refreshToken?: string): void {
  Cookies.set(AUTH_COOKIE_NAMES.accessToken, accessToken, {
    ...AUTH_COOKIE_OPTIONS,
    expires: ACCESS_TOKEN_MAX_AGE_DAYS,
  });

  if (refreshToken) {
    Cookies.set(AUTH_COOKIE_NAMES.refreshToken, refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      expires: REFRESH_TOKEN_MAX_AGE_DAYS,
    });
  }
}

export function clearAuthCookies(): void {
  Cookies.remove(AUTH_COOKIE_NAMES.accessToken, { path: "/" });
  Cookies.remove(AUTH_COOKIE_NAMES.refreshToken, { path: "/" });
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}
