"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      disabled={!mounted}
      aria-label={isDark ? t("themeLight") : t("themeDark")}
      className={cn(
        "cursor-pointer rounded-full text-popover-foreground",
        className,
      )}
    >
      <span className="sr-only">
        {isDark ? t("themeLight") : t("themeDark")}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -90, scale: 0.75 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.75 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center"
          >
            {isDark ? (
              <Sun className="size-[1.125rem]" aria-hidden />
            ) : (
              <Moon className="size-[1.125rem]" aria-hidden />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
