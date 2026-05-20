import { baseApi } from "@/store/baseApi";
import {
  clearAuthCookies,
  getRefreshToken,
  setAuthCookies,
} from "@/lib/auth/cookies";
import type {
  AuthUser,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";
import { normalizeLoginResponse, normalizeRefreshResponse } from "@/lib/auth/normalize";
import { clearCredentials, setCredentials } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => normalizeLoginResponse(raw),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        setAuthCookies(data.accessToken, data.refreshToken);
        dispatch(setCredentials({ user: data.user }));
      },
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => normalizeLoginResponse(raw),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        setAuthCookies(data.accessToken, data.refreshToken);
        dispatch(setCredentials({ user: data.user }));
      },
    }),

    refreshToken: builder.mutation<RefreshTokenResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken: getRefreshToken() },
      }),
      transformResponse: (raw: unknown) => normalizeRefreshResponse(raw),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setAuthCookies(data.accessToken, data.refreshToken);
        } catch {
          clearAuthCookies();
        }
      },
    }),

    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forget-password",
        method: "POST",
        body,
      }),
    }),

    verifyResetCode: builder.mutation<void, VerifyResetCodeRequest>({
      query: (body) => ({
        url: "/auth/verify-reset-code",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/changePassword",
        method: "PATCH",
        body,
      }),
    }),

    logout: builder.mutation<void, void>({
      // Backend has no /auth/logout — clear local session only.
      queryFn: async (_arg, { dispatch }) => {
        clearAuthCookies();
        dispatch(clearCredentials());
        return { data: undefined };
      },
      invalidatesTags: ["Auth"],
    }),

    getMe: builder.query<AuthUser, void>({
      query: () => "/auth/me",
      providesTags: ["Auth"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials({ user: data }));
        } catch {
          dispatch(clearCredentials());
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyResetCodeMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
} = authApi;
