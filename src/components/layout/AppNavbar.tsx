"use client";

import { useTranslations } from "next-intl";
import { NavbarBrand } from "./navbar/NavbarBrand";
import { DesktopNavLinks } from "./navbar/DesktopNavLinks";
import { LanguageToggle } from "./navbar/LanguageToggle";
import { ThemeToggle } from "./navbar/ThemeToggle";
import { UserMenu } from "./navbar/UserMenu";
import { MobileNavSheet } from "./navbar/MobileNavSheet";

/**
 * Global sticky navbar: glassmorphism, RTL-aware utilities, mobile sheet.
 */
export function AppNavbar() {
  const tNav = useTranslations("nav");

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 shrink-0 border-b border-border/60 bg-background/70 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <NavbarBrand />

        <nav
          aria-label={tNav("main")}
          className="flex min-w-0 items-center gap-1 sm:gap-2"
        >
          <DesktopNavLinks />

          <div className="ms-1 flex items-center gap-0.5 sm:ms-2 sm:gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <UserMenu />
            <MobileNavSheet />
          </div>
        </nav>
      </div>
    </header>
  );
}
