import { routing, type AppLocale } from "@/i18n/routing";

function resolveLocaleFromPathname(pathname: string): AppLocale {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (segment && routing.locales.includes(segment as AppLocale)) {
    return segment as AppLocale;
  }
  return routing.defaultLocale;
}

function isLoginPath(pathname: string): boolean {
  return routing.locales.some((locale) =>
    pathname.startsWith(`/${locale}/login`),
  );
}

/** Client-side redirect to localized login (use after 401 / invalid session). */
export function redirectToLogin(callbackPath?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const pathname = window.location.pathname;
  if (isLoginPath(pathname)) {
    return;
  }

  const locale = resolveLocaleFromPathname(pathname);
  const callback = callbackPath ?? pathname;
  const params = new URLSearchParams({ callbackUrl: callback });

  window.location.assign(`/${locale}/login?${params.toString()}`);
}
