import {
  INTERNAL_USER_ROLES,
  USER_ROLES,
  type UserRole,
} from "../types/user";

export { INTERNAL_USER_ROLES };

export const USER_ROLE_FILTER_OPTIONS: Array<UserRole | "all"> = [
  "all",
  ...USER_ROLES,
];

export const USER_ROLE_LABEL_KEYS: Record<UserRole, string> = {
  admin: "roleAdmin",
  doctor: "roleDoctor",
  reception: "roleReception",
  patient: "rolePatient",
  user: "roleUser",
};

export const ROLE_FILTER_LABEL_KEYS: Record<UserRole | "all", string> = {
  all: "filterAll",
  admin: "roleAdmin",
  doctor: "roleDoctor",
  reception: "roleReception",
  patient: "rolePatient",
  user: "roleUser",
};
