import type { useTranslations } from "next-intl";

type AuthTranslator = ReturnType<typeof useTranslations<"auth">>;

const AUTH_ERROR_KEYS = new Set([
  "emailRequired",
  "emailInvalid",
  "passwordRequired",
  "nameMin",
  "passwordMin",
  "passwordUppercase",
  "passwordNumber",
  "confirmPasswordRequired",
  "passwordMismatch",
  "termsRequired",
  "otpLength",
  "otpInvalid",
  "newPasswordSameAsCurrent",
]);

export function resolveAuthFieldError(
  t: AuthTranslator,
  message?: string,
): string | undefined {
  if (!message) return undefined;
  if (AUTH_ERROR_KEYS.has(message)) {
    return t(message as Parameters<AuthTranslator>[0]);
  }
  return message;
}
