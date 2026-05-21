import type { Appointment, AppointmentStatus } from "../types/appointment";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pickString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function pickRefId(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (isRecord(value)) {
    return pickString(value.id ?? value._id, fallback);
  }
  return fallback;
}

function pickDisplayName(value: unknown): string | undefined {
  if (!isRecord(value)) return undefined;

  const name = pickString(value.name);
  if (name) return name;

  const first = pickString(value.firstName);
  const last = pickString(value.lastName);
  const full = [first, last].filter(Boolean).join(" ").trim();
  return full || undefined;
}

function normalizeStatus(value: unknown): AppointmentStatus {
  const status = pickString(value).toLowerCase();
  if (status === "completed" || status === "cancelled") {
    return status;
  }
  return "scheduled";
}

export function normalizeAppointment(raw: unknown): Appointment {
  const data = isRecord(raw) && isRecord(raw.data) ? raw.data : raw;
  if (!isRecord(data)) {
    throw new Error("Invalid appointment payload");
  }

  const clinicRef = data.clinicId ?? data.clinic;
  const patientRef = data.patientId ?? data.patient;

  return {
    id: pickString(data.id ?? data._id),
    clinicId: pickRefId(clinicRef),
    patientId: pickRefId(patientRef),
    appointmentDate: pickString(
      data.appointmentDate ?? data.date,
    ),
    startTime: pickString(data.startTime),
    endTime: pickString(data.endTime),
    notes: pickString(data.notes) || undefined,
    status: normalizeStatus(data.status),
    clinicName:
      (pickDisplayName(clinicRef) ?? pickString(data.clinicName)) || undefined,
    patientName:
      (pickDisplayName(patientRef) ?? pickString(data.patientName)) || undefined,
    createdAt: pickString(data.createdAt) || undefined,
    updatedAt: pickString(data.updatedAt) || undefined,
  };
}

export function normalizeAppointmentList(raw: unknown): Appointment[] {
  const list = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.data)
      ? raw.data
      : isRecord(raw) && Array.isArray(raw.appointments)
        ? raw.appointments
        : [];

  return list.map((item) => normalizeAppointment(item));
}

export function formatAppointmentTimeRange(appointment: Appointment): string {
  if (appointment.startTime && appointment.endTime) {
    return `${appointment.startTime} – ${appointment.endTime}`;
  }
  return appointment.startTime || appointment.endTime || "—";
}
