import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarCheck,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";

export type NavLinkItem = {
  href:
    | "/dashboard"
    | "/dashboard/profile"
    | "/dashboard/clinics"
    | "/dashboard/appointments"
    | "/dashboard/users";
  labelKey:
    | "dashboard"
    | "viewProfile"
    | "clinics"
    | "appointments"
    | "users";
  icon: LucideIcon;
  mobileOnly?: boolean;
};

/** Secondary links collapsed into the mobile sheet on small screens. */
export const NAV_LINKS: NavLinkItem[] = [
  {
    href: "/dashboard",
    labelKey: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/clinics",
    labelKey: "clinics",
    icon: Building2,
  },
  {
    href: "/dashboard/appointments",
    labelKey: "appointments",
    icon: CalendarCheck,
  },
  {
    href: "/dashboard/users",
    labelKey: "users",
    icon: Users,
  },
  {
    href: "/dashboard/profile",
    labelKey: "viewProfile",
    icon: User,
  },
];
