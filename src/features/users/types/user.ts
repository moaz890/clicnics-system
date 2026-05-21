export const USER_ROLES = [
  "admin",
  "doctor",
  "reception",
  "patient",
] as const;

export const INTERNAL_USER_ROLES = ["admin", "doctor", "reception"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type InternalUserRole = (typeof INTERNAL_USER_ROLES)[number];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isBlocked: boolean;
}

export interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isBlocked: boolean;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: InternalUserRole;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  role?: InternalUserRole;
}
