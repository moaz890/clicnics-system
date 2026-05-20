"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";

export function DesktopNavLinks() {
  const t = useTranslations("nav");
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
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-slate-100",
              )}
            >
              <Icon className="size-4 opacity-70" aria-hidden />
              {t(labelKey)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
