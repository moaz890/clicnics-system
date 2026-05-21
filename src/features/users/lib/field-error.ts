import type { useTranslations } from "next-intl";

type UsersTranslator = ReturnType<typeof useTranslations<"users">>;

const USER_FIELD_ERROR_KEYS = new Set([
  "firstNameRequired",
  "lastNameRequired",
  "emailRequired",
  "emailInvalid",
  "passwordRequired",
  "passwordMin",
  "passwordUppercase",
  "passwordNumber",
  "confirmPasswordRequired",
  "passwordMismatch",
  "phoneRequired",
  "roleRequired",
]);

export function resolveUserFieldError(
  t: UsersTranslator,
  message?: string,
): string | undefined {
  if (!message) return undefined;
  if (USER_FIELD_ERROR_KEYS.has(message)) {
    return t(message);
  }
  return message;
}
