export const ADMIN_ROLE = "admin" as const;

export type UserRole = typeof ADMIN_ROLE | string;

export function normalizeRole(role?: string | null): string | undefined {
  const trimmed = role?.trim().toLowerCase();
  return trimmed || undefined;
}

export function isAdminRole(role?: string | null): boolean {
  return normalizeRole(role) === ADMIN_ROLE;
}
