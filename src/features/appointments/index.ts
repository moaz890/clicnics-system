export {
  appointmentsApi,
  appointmentTags,
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} from "./appointmentsApi";
export type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "./types/appointment";
export { AppointmentsManagementPage } from "./components/AppointmentsManagementPage";
export { BookSlotConfirmationDialog } from "./components/BookSlotConfirmationDialog";
