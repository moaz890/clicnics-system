import type { User, UserListItem, UserRole } from "../types/user";
import { USER_ROLES } from "../types/user";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pickString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function pickBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeRole(value: unknown): UserRole {
  const role = pickString(value).toLowerCase();
  if ((USER_ROLES as readonly string[]).includes(role)) {
    return role as UserRole;
  }
  return "user";
}

export function normalizeUser(raw: unknown): User {
  const data = isRecord(raw) && isRecord(raw.data) ? raw.data : raw;
  if (!isRecord(data)) {
    throw new Error("Invalid user payload");
  }

  return {
    id: pickString(data.id ?? data._id),
    firstName: pickString(data.firstName),
    lastName: pickString(data.lastName),
    email: pickString(data.email),
    phoneNumber: pickString(data.phoneNumber ?? data.phone),
    role: normalizeRole(data.role),
    isBlocked: pickBoolean(data.isBlocked ?? data.blocked, false),
  };
}

export function normalizeUserList(raw: unknown): UserListItem[] {
  const list = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.data)
      ? raw.data
      : isRecord(raw) && Array.isArray(raw.users)
        ? raw.users
        : [];

  return list.map((item) => {
    const user = normalizeUser(item);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isBlocked: user.isBlocked,
    };
  });
}

export function getUserFullName(user: {
  firstName: string;
  lastName: string;
}): string {
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}
