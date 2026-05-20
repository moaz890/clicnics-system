/** Paths after locale prefix that require a valid access token. */
export const PROTECTED_PATH_PREFIXES = ["/dashboard"] as const;

/** Paths after locale prefix only for guests (redirect to dashboard if authenticated). */
export const GUEST_ONLY_PATH_PREFIXES = [
  "/login",
  "/register",
] as const;

export function isProtectedPath(pathWithoutLocale: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) =>
      pathWithoutLocale === prefix ||
      pathWithoutLocale.startsWith(`${prefix}/`),
  );
}

export function isGuestOnlyPath(pathWithoutLocale: string): boolean {
  return GUEST_ONLY_PATH_PREFIXES.some(
    (prefix) =>
      pathWithoutLocale === prefix ||
      pathWithoutLocale.startsWith(`${prefix}/`),
  );
}
