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
  setAuthCookies,
} from "@/lib/auth/cookies";
import { applyTenantHeader } from "@/lib/tenant/extract";
import type { RefreshTokenResponse } from "@/types/auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://52.3.221.28:5050/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = getAccessToken();
    if (accessToken) {
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
  if (requestUrl.includes("/auth/refresh") || requestUrl.includes("/auth/login")) {
    return result;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const tokens = refreshResult.data as RefreshTokenResponse;
        setAuthCookies(tokens.accessToken, tokens.refreshToken);
        return tokens;
      }

      clearAuthCookies();
      return null;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  const refreshed = await refreshPromise;

  if (refreshed) {
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Clinic", "Appointment", "Patient", "User"],
  endpoints: () => ({}),
});
