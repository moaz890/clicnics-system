export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
];

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: AppointmentStatus;
  clinicName?: string;
  patientName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentPayload {
  clinicId: string;
  patientId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export type UpdateAppointmentPayload = Partial<CreateAppointmentPayload> & {
  status?: AppointmentStatus;
};
