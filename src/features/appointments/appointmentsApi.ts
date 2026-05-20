import { baseApi } from "@/store/baseApi";

export interface AppointmentSummary {
  id: string;
  patientName: string;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled";
}

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<AppointmentSummary[], void>({
      query: () => "/appointments",
      providesTags: ["Appointment"],
    }),
  }),
});

export const { useGetAppointmentsQuery } = appointmentsApi;
