"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { WEEK_DAYS } from "../lib/constants";
import type { Clinic } from "../types/clinic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ClinicScheduleTab({ clinic }: { clinic: Clinic }) {
  const t = useTranslations("clinics");
  const scheduleMap = new Map(clinic.schedules.map((s) => [s.day, s]));

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {WEEK_DAYS.map((day, index) => {
        const schedule = scheduleMap.get(day.key);
        const isOpen = Boolean(schedule);

        return (
          <motion.div
            key={day.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <Card
              className={cn(
                "h-full border-border/80 transition-shadow",
                isOpen && "ring-1 ring-[var(--design-accent-teal)]/20",
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span>{t(day.labelKey)}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      isOpen
                        ? "bg-[var(--design-success)]/10 text-[var(--design-success)]"
                        : "bg-[var(--design-surface-soft)] text-[var(--design-muted)]",
                    )}
                  >
                    {isOpen ? t("open") : t("closed")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isOpen && schedule ? (
                  <div className="flex items-center gap-2 text-sm text-popover-foreground">
                    <Clock className="size-4 text-primary" aria-hidden />
                    <span dir="ltr">
                      {schedule.startTime} – {schedule.endTime}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("noHours")}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
