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
} from "@/lib/auth/cookies";
import { redirectToLogin } from "@/lib/auth/redirect";
import { isAccessTokenValid } from "@/lib/auth/token";
import { applyTenantHeader } from "@/lib/tenant/extract";
import { clearCredentials } from "@/features/auth/authSlice";
import type { AppDispatch } from "./store";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://52.3.221.28:5050/api";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const accessToken = getAccessToken()?.trim();
    if (accessToken) {
      headers.set("token", accessToken);
    }

    if (typeof window !== "undefined") {
      applyTenantHeader(headers, window.location.hostname);
    }

    headers.set("Accept", "application/json");
    return headers;
  },
});

/**
 * No refresh-token endpoint on the API. On 401, only clear the session when the
 * access token is missing or expired locally — not on every unauthorized response.
 */
const baseQueryWithSessionCheck: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const requestUrl = typeof args === "string" ? args : args.url;
  if (
    requestUrl.includes("/auth/login") ||
    requestUrl.includes("/auth/register") ||
    requestUrl.includes("/auth/forget-password") ||
    requestUrl.includes("/auth/verify-reset-code") ||
    requestUrl.includes("/auth/reset-password")
  ) {
    return result;
  }

  const token = getAccessToken();
  if (!token || !isAccessTokenValid(token)) {
    clearAuthCookies();
    (api.dispatch as AppDispatch)(clearCredentials());
    redirectToLogin();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithSessionCheck,
  tagTypes: ["Auth", "Clinic", "Appointment", "Patient", "User"],
  endpoints: () => ({}),
});
