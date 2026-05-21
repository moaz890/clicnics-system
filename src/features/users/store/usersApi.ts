import { baseApi } from "@/store/baseApi";
import { normalizeUser, normalizeUserList } from "../lib/normalize";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserListItem,
} from "../types/user";

export const userTags = {
  all: [{ type: "User" as const, id: "LIST" }],
  detail: (id: string) => [{ type: "User" as const, id }],
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListItem[], void>({
      query: () => "/user",
      transformResponse: (raw: unknown) => normalizeUserList(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User" as const, id })),
              ...userTags.all,
            ]
          : userTags.all,
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `/user/${id}`,
      transformResponse: (raw: unknown) => normalizeUser(raw),
      providesTags: (_result, _error, id) => userTags.detail(id),
    }),

    createUser: builder.mutation<User, CreateUserPayload>({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => normalizeUser(raw),
      invalidatesTags: userTags.all,
    }),

    updateUser: builder.mutation<User, { id: string; body: UpdateUserPayload }>(
      {
        query: ({ id, body }) => ({
          url: `/user/${id}`,
          method: "PATCH",
          body,
        }),
        transformResponse: (raw: unknown) => normalizeUser(raw),
        invalidatesTags: (_result, _error, { id }) => [
          ...userTags.all,
          ...userTags.detail(id),
        ],
      },
    ),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        ...userTags.all,
        ...userTags.detail(id),
      ],
    }),

    toggleUserBlock: builder.mutation<User, string>({
      query: (id) => ({
        url: `/user/${id}/toggle-block`,
        method: "PATCH",
      }),
      transformResponse: (raw: unknown) => normalizeUser(raw),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData("getUsers", undefined, (draft) => {
            const user = draft.find((item) => item.id === id);
            if (user) {
              user.isBlocked = !user.isBlocked;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, id) => [
        ...userTags.all,
        ...userTags.detail(id),
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserBlockMutation,
} = usersApi;
