"use client";

import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "./nav-links";

export function MobileNavSheet() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const isRtl = locale === "ar";

  return (
    <Sheet>
      <SheetTrigger
        className="md:hidden"
        render={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer text-foreground"
            aria-label={t("openMobileMenu")}
          />
        }
      >
        <Menu className="size-5" aria-hidden />
      </SheetTrigger>
      <SheetContent
        side={isRtl ? "left" : "right"}
        className="w-[min(100%,20rem)] border-border bg-popover/95 backdrop-blur-md"
      >
        <SheetHeader>
          <SheetTitle className="text-start text-foreground">
            {t("menu")}
          </SheetTitle>
        </SheetHeader>
        <nav
          aria-label={t("main")}
          className="mt-4 flex flex-col gap-1"
        >
          {NAV_LINKS.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--design-primary)]/10 text-[var(--design-primary)] dark:text-[var(--design-primary)]"
                    : "text-[var(--design-body)] hover:bg-[var(--design-surface-soft)] dark:text-[var(--design-on-dark)] dark:hover:bg-[var(--design-surface-dark-soft)]",
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
