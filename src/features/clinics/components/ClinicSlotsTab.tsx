"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Loader2, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useGetClinicAvailableSlotsQuery } from "../store/clinicsApi";
import { getToday, isDateBeforeToday, stringifyApiDate } from "../lib/date";
import {
  BookSlotConfirmationDialog,
  type BookSlotSelection,
} from "@/features/appointments/components/BookSlotConfirmationDialog";
import { isPatientRole } from "@/features/appointments/lib/roles";
import { useUserRole } from "@/features/auth/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { AvailableSlot } from "../types/clinic";

interface ClinicSlotsTabProps {
  clinicId: string;
  clinicName: string;
}

function slotTimes(slot: AvailableSlot): {
  startTime: string;
  endTime: string;
  label: string;
} {
  const label =
    slot.time ??
    (slot.startTime && slot.endTime
      ? `${slot.startTime} – ${slot.endTime}`
      : slot.startTime ?? "—");

  let startTime = slot.startTime ?? "";
  let endTime = slot.endTime ?? "";

  if (!startTime && slot.time?.includes("–")) {
    const [start, end] = slot.time.split("–").map((s) => s.trim());
    startTime = start ?? "";
    endTime = end ?? startTime;
  } else if (!startTime && slot.time) {
    startTime = slot.time.trim();
    endTime = startTime;
  }

  return { startTime, endTime, label };
}

export function ClinicSlotsTab({ clinicId, clinicName }: ClinicSlotsTabProps) {
  const t = useTranslations("clinics");
  const locale = useLocale();
  const dateFnsLocale = locale === "ar" ? ar : enUS;
  const reduceMotion = useReducedMotion();
  const role = useUserRole();
  const canBook = isPatientRole(role);

  const [selectedDate, setSelectedDate] = useState<Date>(getToday);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [bookingSelection, setBookingSelection] =
    useState<BookSlotSelection | null>(null);
  const [bookDialogOpen, setBookDialogOpen] = useState(false);

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

  const formattedSelectedDate = format(selectedDate, "PPP", {
    locale: dateFnsLocale,
  });

  const openBooking = (slot: AvailableSlot) => {
    const { startTime, endTime, label } = slotTimes(slot);
    if (!startTime) return;

    setBookingSelection({
      clinicId,
      clinicName,
      appointmentDate: apiDate,
      startTime,
      endTime: endTime || startTime,
      timeLabel: label,
      dateLabel: formattedSelectedDate,
    });
    setBookDialogOpen(true);
  };

  const renderSlot = (slot: AvailableSlot, index: number) => {
    const available = slot.available !== false;
    const { label } = slotTimes(slot);
    const chipClass = cn(
      "list-none rounded-full border px-4 py-2 text-sm font-medium transition-colors",
      available && canBook
        ? "cursor-pointer border-[var(--design-success)]/30 bg-[var(--design-success)]/10 text-[var(--design-success)] hover:ring-2 hover:ring-[var(--design-success)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        : available
          ? "border-[var(--design-success)]/30 bg-[var(--design-success)]/10 text-[var(--design-success)]"
          : "cursor-default border-border bg-muted text-muted-foreground line-through opacity-60",
    );
    const chipLabel = available
      ? t("slotAvailable", { time: label })
      : t("slotUnavailable", { time: label });

    const handleClick = () => {
      if (available && canBook) {
        openBooking(slot);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (!available || !canBook) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBooking(slot);
      }
    };

    const commonProps = {
      "aria-label": chipLabel,
      className: chipClass,
      dir: "ltr" as const,
      ...(available && canBook
        ? {
            role: "button" as const,
            tabIndex: 0,
            onClick: handleClick,
            onKeyDown: handleKeyDown,
          }
        : {}),
    };

    if (reduceMotion) {
      return (
        <li key={slot.id ?? `${label}-${index}`} {...commonProps}>
          {label}
        </li>
      );
    }

    return (
      <motion.li
        key={slot.id ?? `${label}-${index}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.02 }}
        {...commonProps}
      >
        {label}
      </motion.li>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-start">
          <h3 className="text-base font-semibold text-foreground">
            {t("liveSlotsTitle")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {canBook ? t("liveSlotsBookHint") : t("liveSlotsDescription")}
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
              <CalendarDays className="size-4 text-primary" aria-hidden />
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
          className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground"
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
          className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground"
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
          {slots.map((slot, index) => renderSlot(slot, index))}
        </ul>
      )}

      <BookSlotConfirmationDialog
        selection={bookingSelection}
        open={bookDialogOpen}
        onOpenChange={setBookDialogOpen}
      />
    </div>
  );
}
