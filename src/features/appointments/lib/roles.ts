import { normalizeRole } from "@/lib/auth/roles";

export function isPatientRole(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "user" || normalized === "patient";
}

export function isStaffReadOnlyRole(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "doctor" || normalized === "reception";
}
