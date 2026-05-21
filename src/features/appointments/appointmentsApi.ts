import { baseApi } from "@/store/baseApi";
import { normalizeAppointment, normalizeAppointmentList } from "./lib/normalize";
import type {
  Appointment,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "./types/appointment";

export const appointmentTags = {
  all: [{ type: "Appointment" as const, id: "LIST" }],
  detail: (id: string) => [{ type: "Appointment" as const, id }],
  clinicSlots: (clinicId: string, date: string) => [
    { type: "Clinic" as const, id: `SLOTS-${clinicId}-${date}` },
  ],
};

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<Appointment[], void>({
      query: () => "/appointments",
      transformResponse: (raw: unknown) => normalizeAppointmentList(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Appointment" as const,
                id,
              })),
              ...appointmentTags.all,
            ]
          : appointmentTags.all,
    }),

    getAppointmentById: builder.query<Appointment, string>({
      query: (id) => `/appointments/${id}`,
      transformResponse: (raw: unknown) => normalizeAppointment(raw),
      providesTags: (_result, _error, id) => appointmentTags.detail(id),
    }),

    createAppointment: builder.mutation<Appointment, CreateAppointmentPayload>({
      query: (body) => ({
        url: "/appointments",
        method: "POST",
        body,
      }),
      transformResponse: (raw: unknown) => normalizeAppointment(raw),
      invalidatesTags: (_result, _error, arg) =>
        [
          ...appointmentTags.all,
          ...appointmentTags.clinicSlots(arg.clinicId, arg.appointmentDate),
        ] as const,
    }),

    updateAppointment: builder.mutation<
      Appointment,
      { id: string; body: UpdateAppointmentPayload }
    >({
      query: ({ id, body }) => ({
        url: `/appointments/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (raw: unknown) => normalizeAppointment(raw),
      invalidatesTags: (result, _error, { id }) =>
        [
          ...appointmentTags.all,
          ...appointmentTags.detail(id),
          ...(result?.clinicId && result?.appointmentDate
            ? appointmentTags.clinicSlots(
                result.clinicId,
                result.appointmentDate,
              )
            : []),
        ] as const,
    }),

    deleteAppointment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        ...appointmentTags.all,
        ...appointmentTags.detail(id),
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentsApi;
