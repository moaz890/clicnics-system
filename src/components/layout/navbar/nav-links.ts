import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, User } from "lucide-react";

export type NavLinkItem = {
  href: "/dashboard" | "/dashboard/profile";
  labelKey: "dashboard" | "viewProfile";
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
    href: "/dashboard/profile",
    labelKey: "viewProfile",
    icon: User,
  },
];
