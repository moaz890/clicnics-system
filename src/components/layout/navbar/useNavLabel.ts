"use client";

import { useTranslations } from "next-intl";
import type { NavLinkItem } from "./nav-links";

/** Resolves nav link labels with explicit keys (avoids dynamic key misses in next-intl). */
export function useNavLabel(labelKey: NavLinkItem["labelKey"]): string {
  const t = useTranslations("nav");

  switch (labelKey) {
    case "dashboard":
      return t("dashboard");
    case "viewProfile":
      return t("viewProfile");
    case "clinics":
      return t("clinics");
    case "appointments":
      return t("appointments");
    case "users":
      return t("users");
    default:
      return labelKey;
  }
}
