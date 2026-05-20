import { baseApi } from "@/store/baseApi";

export interface ClinicSummary {
  id: string;
  name: string;
  slug: string;
  status: "active" | "inactive";
}

export const clinicsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClinics: builder.query<ClinicSummary[], void>({
      query: () => "/clinics",
      providesTags: ["Clinic"],
    }),
    getClinicById: builder.query<ClinicSummary, string>({
      query: (id) => `/clinics/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Clinic", id }],
    }),
  }),
});

export const { useGetClinicsQuery, useGetClinicByIdQuery } = clinicsApi;
