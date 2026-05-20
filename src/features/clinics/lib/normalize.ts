import { DEFAULT_SCHEDULE_TEMPLATE, WEEK_DAYS } from "./constants";
import type {
  AvailableSlot,
  Clinic,
  ClinicListItem,
  ClinicLocation,
  ClinicSchedule,
} from "../types/clinic";

export type FormScheduleDay = ClinicSchedule & { enabled: boolean };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function pickString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function pickNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function pickBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

function normalizeLocation(raw: unknown): ClinicLocation {
  if (!isRecord(raw)) return { lat: 0, lng: 0 };
  return {
    lat: pickNumber(raw.lat),
    lng: pickNumber(raw.lng),
  };
}

function normalizeSchedule(raw: unknown): ClinicSchedule {
  if (!isRecord(raw)) {
    return { day: "monday", startTime: "09:00", endTime: "17:00" };
  }
  return {
    day: pickString(raw.day, "monday"),
    startTime: pickString(raw.startTime, "09:00"),
    endTime: pickString(raw.endTime, "17:00"),
  };
}

export function normalizeClinic(raw: unknown): Clinic {
  const data = isRecord(raw) && isRecord(raw.data) ? raw.data : raw;
  if (!isRecord(data)) {
    throw new Error("Invalid clinic payload");
  }

  const schedulesRaw = Array.isArray(data.schedules) ? data.schedules : [];

  return {
    id: pickString(data.id ?? data._id),
    userId: pickString(data.userId),
    name: pickString(data.name),
    address: pickString(data.address),
    phone: pickString(data.phone),
    location: normalizeLocation(data.location),
    examinationFee: pickNumber(data.examinationFee),
    slotDuration: pickNumber(data.slotDuration, 30),
    schedules: schedulesRaw.map(normalizeSchedule),
    isActive: pickBoolean(data.isActive, true),
    createdAt: pickString(data.createdAt) || undefined,
    updatedAt: pickString(data.updatedAt) || undefined,
  };
}

export function normalizeClinicList(raw: unknown): ClinicListItem[] {
  const list = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.data)
      ? raw.data
      : isRecord(raw) && Array.isArray(raw.clinics)
        ? raw.clinics
        : [];

  return list.map((item) => {
    const clinic = normalizeClinic(item);
    return {
      id: clinic.id,
      name: clinic.name,
      phone: clinic.phone,
      examinationFee: clinic.examinationFee,
      isActive: clinic.isActive,
    };
  });
}

export function normalizeAvailableSlots(raw: unknown): AvailableSlot[] {
  const list = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw.data)
      ? raw.data
      : isRecord(raw) && Array.isArray(raw.slots)
        ? raw.slots
        : [];

  return list.map((item, index) => {
    if (!isRecord(item)) {
      return { id: String(index), time: String(item), available: true };
    }
    return {
      id: pickString(item.id, String(index)),
      date: pickString(item.date) || undefined,
      time: pickString(item.time ?? item.slot) || undefined,
      startTime: pickString(item.startTime) || undefined,
      endTime: pickString(item.endTime) || undefined,
      available: pickBoolean(item.available, true),
      status: pickString(item.status) || undefined,
    };
  });
}

export function clinicToFormSchedules(schedules: ClinicSchedule[]): FormScheduleDay[] {
  const map = new Map(schedules.map((s) => [s.day, s]));
  return WEEK_DAYS.map((day) => {
    const existing = map.get(day.key);
    return {
      day: day.key,
      enabled: Boolean(existing),
      startTime: existing?.startTime ?? "09:00",
      endTime: existing?.endTime ?? "17:00",
    };
  });
}

export function formSchedulesToApi(
  schedules: FormScheduleDay[],
): ClinicSchedule[] {
  return schedules
    .filter((s) => s.enabled)
    .map(({ day, startTime, endTime }) => ({ day, startTime, endTime }));
}

export function getDefaultFormSchedules(): FormScheduleDay[] {
  return DEFAULT_SCHEDULE_TEMPLATE.map((s) => ({ ...s }));
}
