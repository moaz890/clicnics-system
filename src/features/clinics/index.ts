export {
  clinicsApi,
  useGetClinicsQuery,
  useGetClinicByIdQuery,
  useCreateClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
  useGetClinicAvailableSlotsQuery,
} from "./store/clinicsApi";
export type {
  Clinic,
  ClinicListItem,
  AvailableSlot,
  CreateClinicPayload,
} from "./types/clinic";
