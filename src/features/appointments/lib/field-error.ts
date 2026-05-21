import type { useTranslations } from "next-intl";

type AppointmentsTranslator = ReturnType<typeof useTranslations<"appointments">>;

const APPOINTMENT_FIELD_ERROR_KEYS = new Set([
  "dateRequired",
  "dateInvalid",
  "startTimeRequired",
  "endTimeRequired",
  "timeOrderInvalid",
  "notesMax",
]);

export function resolveAppointmentFieldError(
  t: AppointmentsTranslator,
  message?: string,
): string | undefined {
  if (!message) return undefined;
  if (APPOINTMENT_FIELD_ERROR_KEYS.has(message)) {
    return t(message);
  }
  return message;
}
