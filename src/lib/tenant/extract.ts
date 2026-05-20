import { TENANT_HEADER } from "./constants";

/**
 * Extracts tenant slug from hostname by subdomain.
 *
 * @example
 * - `dr-tarek.platform.com` → `dr-tarek`
 * - `www.platform.com` → `null`
 * - `platform.com` → `null`
 * - `localhost` → `null`
 *
 * Requires 3+ dot-separated segments (`slug.domain.tld`).
 */
export function getTenantSlugFromHostname(hostname: string): string | null {
  const host = hostname.split(":")[0] ?? hostname;
  const parts = host.split(".");

  if (parts.length > 2 && parts[0] !== "www") {
    return parts[0];
  }

  return null;
}

/** Sets `X-Tenant-ID` on fetch headers when a tenant subdomain is present. */
export function applyTenantHeader(headers: Headers, hostname: string): void {
  const tenantSlug = getTenantSlugFromHostname(hostname);

  if (tenantSlug) {
    headers.set(TENANT_HEADER, tenantSlug);
  }
}

/** @deprecated Use `getTenantSlugFromHostname` instead. */
export const extractTenantFromHost = getTenantSlugFromHostname;
