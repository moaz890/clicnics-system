import type { AuthUser } from "@/types/auth";
import { normalizeRole } from "./roles";

type RawAuthPayload = Record<string, unknown>;

/**
 * API shape:
 * {
 *   meta: { status, success, message },
 *   data: { token: string, user: { id, role?, email?, name? } }
 * }
 */
function unwrapPayload(raw: unknown): RawAuthPayload {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const root = raw as RawAuthPayload;

  if (root.meta && typeof root.meta === "object") {
    const meta = root.meta as RawAuthPayload;
    if (meta.success === false) {
      const message =
        typeof meta.message === "string" ? meta.message : "Request failed";
      throw new Error(message);
    }
  }

  if (root.data && typeof root.data === "object") {
    return root.data as RawAuthPayload;
  }

  return root;
}

function readToken(payload: RawAuthPayload, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function normalizeUser(payload: RawAuthPayload): AuthUser {
  const userRaw =
    payload.user && typeof payload.user === "object"
      ? (payload.user as RawAuthPayload)
      : payload;

  const id = String(userRaw.id ?? userRaw.userId ?? "");
  if (!id) {
    throw new Error("Login response missing user id");
  }

  return {
    id,
    email: typeof userRaw.email === "string" ? userRaw.email : undefined,
    name:
      typeof userRaw.name === "string"
        ? userRaw.name
        : typeof userRaw.fullName === "string"
          ? userRaw.fullName
          : undefined,
    role:
      typeof userRaw.role === "string"
        ? normalizeRole(userRaw.role)
        : undefined,
  };
}

/** Maps API login/register payload to cookies + Redux user. */
export function normalizeLoginResponse(raw: unknown): {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
} {
  const payload = unwrapPayload(raw);

  const accessToken = readToken(
    payload,
    "token",
    "accessToken",
    "access_token",
    "jwt",
  );
  const refreshToken = readToken(payload, "refreshToken", "refresh_token");

  if (!accessToken) {
    throw new Error("Login response missing access token");
  }

  return {
    accessToken,
    refreshToken,
    user: normalizeUser(payload),
  };
}

export function normalizeRefreshResponse(raw: unknown): {
  accessToken: string;
  refreshToken?: string;
} {
  const payload = unwrapPayload(raw);

  const accessToken = readToken(
    payload,
    "token",
    "accessToken",
    "access_token",
  );
  const refreshToken = readToken(payload, "refreshToken", "refresh_token");

  if (!accessToken) {
    throw new Error("Refresh response missing access token");
  }

  return { accessToken, refreshToken };
}
