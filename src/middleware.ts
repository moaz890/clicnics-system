// Tenant slug: hostname split (e.g. dr-tarek.platform.com → dr-tarek)
import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/lib/auth/cookies";
import { TENANT_HEADER } from "@/lib/tenant/constants";
import { getTenantSlugFromHostname } from "@/lib/tenant/extract";
import { routing, type AppLocale } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const DASHBOARD_PATH = "/dashboard";

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

function isDashboardRoute(pathWithoutLocale: string): boolean {
  return (
    pathWithoutLocale === DASHBOARD_PATH ||
    pathWithoutLocale.startsWith(`${DASHBOARD_PATH}/`)
  );
}

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0] ?? host;
  const tenantId = getTenantSlugFromHostname(hostname);
  const { pathname } = request.nextUrl;

  const { locale, pathWithoutLocale } = parsePathname(pathname);
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value;

  if (locale && isDashboardRoute(pathWithoutLocale) && !accessToken) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${locale}/login`;
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
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
