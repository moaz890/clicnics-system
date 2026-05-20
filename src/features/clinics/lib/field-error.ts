import type { useTranslations } from "next-intl";

type ClinicsTranslator = ReturnType<typeof useTranslations<"clinics">>;

const CLINIC_ERROR_KEYS = new Set([
  "nameMin",
  "addressRequired",
  "phoneRequired",
  "feeMin",
  "slotDurationInvalid",
  "scheduleRequired",
  "startTimeRequired",
  "endTimeRequired",
  "scheduleTimeOrder",
  "userIdRequired",
]);

export function resolveClinicFieldError(
  t: ClinicsTranslator,
  message?: string,
): string | undefined {
  if (!message) return undefined;
  if (CLINIC_ERROR_KEYS.has(message)) {
    return t(message as Parameters<ClinicsTranslator>[0]);
  }
  return message;
}
