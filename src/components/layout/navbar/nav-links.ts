import type { LucideIcon } from "lucide-react";
import { Building2, LayoutDashboard, User } from "lucide-react";

export type NavLinkItem = {
  href: "/dashboard" | "/dashboard/profile" | "/dashboard/clinics";
  labelKey: "dashboard" | "viewProfile" | "clinics";
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
    href: "/dashboard/profile",
    labelKey: "viewProfile",
    icon: User,
  },
];
