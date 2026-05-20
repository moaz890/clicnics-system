import { baseApi } from "@/store/baseApi";
import {
  normalizeAvailableSlots,
  normalizeClinic,
  normalizeClinicList,
} from "../lib/normalize";
import type {
  AvailableSlot,
  Clinic,
  ClinicListItem,
  CreateClinicPayload,
  UpdateClinicPayload,
} from "../types/clinic";

const clinicTags = {
  all: [{ type: "Clinic" as const, id: "LIST" }],
  detail: (id: string) => [{ type: "Clinic" as const, id }],
};

export const clinicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinics: builder.query<ClinicListItem[], void>({
      query: () => "/clinic",
      transformResponse: (raw: unknown) => normalizeClinicList(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Clinic" as const, id })),
              ...clinicTags.all,
            ]
          : clinicTags.all,
    }),

    getClinicById: builder.query<Clinic, string>({
      query: (id) => `/clinic/${id}`,
      transformResponse: (raw: unknown) => normalizeClinic(raw),
      providesTags: (_result, _error, id) => clinicTags.detail(id),
    }),

    createClinic: builder.mutation<Clinic, CreateClinicPayload>({
      query: (body) => ({
        url: "/clinic",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => normalizeClinic(raw),
      invalidatesTags: clinicTags.all,
    }),

    updateClinic: builder.mutation<
      Clinic,
      { id: string; body: UpdateClinicPayload }
    >({
      query: ({ id, body }) => ({
        url: `/clinic/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (raw: unknown) => normalizeClinic(raw),
      invalidatesTags: (_result, _error, { id }) => [
        ...clinicTags.all,
        ...clinicTags.detail(id),
      ],
    }),

    deleteClinic: builder.mutation<void, string>({
      query: (id) => ({
        url: `/clinic/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        ...clinicTags.all,
        ...clinicTags.detail(id),
      ],
    }),

    getClinicAvailableSlots: builder.query<
      AvailableSlot[],
      { clinicId: string; date: string }
    >({
      query: ({ clinicId, date }) => ({
        url: `/clinic/all-available-slots/${clinicId}`,
        params: { date },
      }),
      transformResponse: (raw: unknown) => normalizeAvailableSlots(raw),
      providesTags: (_result, _error, { clinicId, date }) => [
        { type: "Clinic" as const, id: `SLOTS-${clinicId}-${date}` },
      ],
    }),
  }),
});

export const {
  useGetClinicsQuery,
  useGetClinicByIdQuery,
  useCreateClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
  useGetClinicAvailableSlotsQuery,
} = clinicsApi;
