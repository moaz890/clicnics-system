"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Loader2, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useGetClinicAvailableSlotsQuery } from "../store/clinicsApi";
import { getToday, isDateBeforeToday, stringifyApiDate } from "../lib/date";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ClinicSlotsTabProps {
  clinicId: string;
}

export function ClinicSlotsTab({ clinicId }: ClinicSlotsTabProps) {
  const t = useTranslations("clinics");
  const locale = useLocale();
  const dateFnsLocale = locale === "ar" ? ar : enUS;
  const reduceMotion = useReducedMotion();

  const [selectedDate, setSelectedDate] = useState<Date>(getToday);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const apiDate = stringifyApiDate(selectedDate);

  const {
    data: slots = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetClinicAvailableSlotsQuery(
    { clinicId, date: apiDate },
    { skip: !clinicId || !apiDate },
  );

  const labelFor = (slot: (typeof slots)[number]) =>
    slot.time ??
    (slot.startTime && slot.endTime
      ? `${slot.startTime} – ${slot.endTime}`
      : slot.startTime ?? slot.date ?? "—");

  const formattedSelectedDate = format(selectedDate, "PPP", {
    locale: dateFnsLocale,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-start">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {t("liveSlotsTitle")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("liveSlotsDescription")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              className={cn(
                "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              )}
              aria-label={t("selectDate")}
              aria-expanded={calendarOpen}
              aria-haspopup="dialog"
            >
              <CalendarDays className="size-4 text-teal-700" aria-hidden />
              <span className="text-start">{formattedSelectedDate}</span>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (!date || isDateBeforeToday(date)) {
                    return;
                  }
                  setSelectedDate(date);
                  setCalendarOpen(false);
                }}
                disabled={(date) => isDateBeforeToday(date)}
                defaultMonth={selectedDate}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-busy={isFetching}
            className="cursor-pointer rounded-lg"
          >
            {isFetching ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="size-4" aria-hidden />
            )}
            {t("refreshSlots")}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-2 py-12 text-sm text-slate-600 dark:text-slate-400"
        >
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t("loadingSlots")}
        </div>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive"
        >
          {t("slotsError")}
        </div>
      )}

      {!isLoading && !isError && slots.length === 0 && (
        <div
          role="status"
          className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-slate-600 dark:text-slate-400"
        >
          {t("noSlotsOnDate", { date: formattedSelectedDate })}
        </div>
      )}

      {!isLoading && !isError && slots.length > 0 && (
        <ul
          role="list"
          aria-label={t("slotsListLabel")}
          className="flex flex-wrap gap-2"
        >
          {slots.map((slot, index) => {
            const available = slot.available !== false;
            const timeLabel = labelFor(slot);
            const chipClass = cn(
              "list-none rounded-full border px-4 py-2 text-sm font-medium",
              available
                ? "border-teal-600/30 bg-teal-600/10 text-teal-800 dark:text-teal-300"
                : "border-border bg-muted text-slate-600 line-through opacity-60 dark:text-slate-400",
            );
            const chipLabel = available
              ? t("slotAvailable", { time: timeLabel })
              : t("slotUnavailable", { time: timeLabel });

            if (reduceMotion) {
              return (
                <li
                  key={slot.id ?? `${timeLabel}-${index}`}
                  aria-label={chipLabel}
                  className={chipClass}
                  dir="ltr"
                >
                  {timeLabel}
                </li>
              );
            }

            return (
              <motion.li
                key={slot.id ?? `${timeLabel}-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                aria-label={chipLabel}
                className={chipClass}
                dir="ltr"
              >
                {timeLabel}
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
