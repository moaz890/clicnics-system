import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/lib/auth/cookies";
import {
  isGuestOnlyPath,
  isProtectedPath,
} from "@/lib/auth/routes";
import { isRequestAuthenticated } from "@/lib/auth/session";
import { TENANT_HEADER } from "@/lib/tenant/constants";
import { getTenantSlugFromHostname } from "@/lib/tenant/extract";
import { routing, type AppLocale } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

function parsePathname(pathname: string): {
  locale: AppLocale | null;
  pathWithoutLocale: string;
} {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && routing.locales.includes(first as AppLocale)) {
    const locale = first as AppLocale;
    const rest = segments.slice(1);
    return {
      locale,
      pathWithoutLocale: rest.length > 0 ? `/${rest.join("/")}` : "/",
    };
  }

  return { locale: null, pathWithoutLocale: pathname };
}

function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(AUTH_COOKIE_NAMES.accessToken);
  response.cookies.delete(AUTH_COOKIE_NAMES.refreshToken);
}

function redirectToLogin(
  request: NextRequest,
  locale: AppLocale,
  callbackPath: string,
): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = `/${locale}/login`;
  loginUrl.searchParams.set("callbackUrl", callbackPath);
  const response = NextResponse.redirect(loginUrl);
  clearAuthCookies(response);
  return response;
}

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0] ?? host;
  const tenantId = getTenantSlugFromHostname(hostname);
  const { pathname } = request.nextUrl;

  const { locale, pathWithoutLocale } = parsePathname(pathname);
  const getCookie = (name: string) => request.cookies.get(name);
  const isAuthenticated = isRequestAuthenticated(getCookie);

  if (locale) {
    if (isProtectedPath(pathWithoutLocale) && !isAuthenticated) {
      return redirectToLogin(request, locale, pathname);
    }

    if (isGuestOnlyPath(pathWithoutLocale) && isAuthenticated) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = `/${locale}/dashboard`;
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  const response = intlMiddleware(request);

  if (tenantId) {
    response.headers.set(TENANT_HEADER, tenantId);
  }

  return response;
}

export const config = {
  matcher: ["/", "/(ar|en)/:path*"],
};
