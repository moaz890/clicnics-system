import { baseApi } from "@/store/baseApi";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import type {
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";
import { normalizeLoginResponse } from "@/lib/auth/normalize";
import { REGISTER_USER_ROLE } from "@/features/users/types/user";
import { userTags } from "@/features/users/store/usersApi";
import { clearCredentials, setCredentials } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      async queryFn(body, _api, _extraOptions, baseQuery) {
        const createResult = await baseQuery({
          url: "/user",
          method: "POST",
          body: {
            firstName: body.firstName.trim(),
            lastName: body.lastName.trim(),
            email: body.email.trim(),
            password: body.password,
            phoneNumber: body.phoneNumber.trim(),
            role: REGISTER_USER_ROLE,
          },
        });

        if (createResult.error) {
          return { error: createResult.error };
        }

        try {
          return {
            data: normalizeLoginResponse(createResult.data),
          };
        } catch {
          const loginResult = await baseQuery({
            url: "/auth/login",
            method: "POST",
            body: {
              email: body.email.trim(),
              password: body.password,
            },
          });

          if (loginResult.error) {
            return { error: loginResult.error };
          }

          return {
            data: normalizeLoginResponse(loginResult.data),
          };
        }
      },
      invalidatesTags: userTags.all,
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setAuthCookies(data.accessToken, data.refreshToken);
          dispatch(setCredentials({ user: data.user }));
        } catch {
          /* Form reads mutation error state */
        }
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

    logout: builder.mutation<null, void>({
      queryFn: async (_arg, { dispatch }) => {
        clearAuthCookies();
        dispatch(clearCredentials());
        return { data: null };
      },
      invalidatesTags: ["Auth"],
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
} = authApi;
