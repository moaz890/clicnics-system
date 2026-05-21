"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";
import { useNavLabel } from "./useNavLabel";

export function DesktopNavLinks() {
  const t = useTranslations("nav");
  const navLabel = useNavLabel;
  const pathname = usePathname();

  return (
    <ul className="hidden items-center gap-1 md:flex">
      {NAV_LINKS.map(({ href, labelKey, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                active
                  ? "text-[var(--design-primary)]"
                  : "text-muted-foreground hover:bg-[var(--design-surface-soft)] hover:text-foreground dark:hover:bg-[var(--design-surface-dark-soft)] dark:hover:text-[var(--design-on-dark)]",
              )}
            >
              <Icon className="size-4 opacity-70" aria-hidden />
              {navLabel(labelKey)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
