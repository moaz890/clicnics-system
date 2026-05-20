import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import { normalizeRefreshResponse } from "@/lib/auth/normalize";
import { redirectToLogin } from "@/lib/auth/redirect";
import { isAccessTokenValid } from "@/lib/auth/token";
import { applyTenantHeader } from "@/lib/tenant/extract";
import { clearCredentials } from "@/features/auth/authSlice";
import type { RefreshTokenResponse } from "@/types/auth";
import type { AppDispatch } from "./store";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://52.3.221.28:5050/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  // Auth: Bearer token from js-cookie (not cross-origin httpOnly cookies).
  // Keeps CORS simple — backend does not need credentials: true for API calls.
  prepareHeaders: (headers) => {
    const accessToken = getAccessToken();
    if (accessToken && isAccessTokenValid(accessToken)) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    if (typeof window !== "undefined") {
      applyTenantHeader(headers, window.location.hostname);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

let refreshPromise: Promise<RefreshTokenResponse | null> | null = null;

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const requestUrl = typeof args === "string" ? args : args.url;
  if (
    requestUrl.includes("/auth/refresh") ||
    requestUrl.includes("/auth/login") ||
    requestUrl.includes("/auth/register") ||
    requestUrl.includes("/auth/forget-password") ||
    requestUrl.includes("/auth/verify-reset-code") ||
    requestUrl.includes("/auth/reset-password")
  ) {
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: refreshToken ? { refreshToken } : undefined,
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const tokens = normalizeRefreshResponse(refreshResult.data);
        setAuthCookies(tokens.accessToken, tokens.refreshToken);
        return tokens;
      }

      clearAuthCookies();
      (api.dispatch as AppDispatch)(clearCredentials());
      redirectToLogin();
      return null;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;

  if (refreshed) {
    result = await rawBaseQuery(args, api, extraOptions);
  } else if (result.error?.status === 401) {
    clearAuthCookies();
    (api.dispatch as AppDispatch)(clearCredentials());
    redirectToLogin();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Clinic", "Appointment", "Patient", "User"],
  endpoints: () => ({}),
});
