"use client";

import { motion } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetClinicAvailableSlotsQuery } from "../store/clinicsApi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ClinicSlotsTabProps {
  clinicId: string;
}

export function ClinicSlotsTab({ clinicId }: ClinicSlotsTabProps) {
  const t = useTranslations("clinics");
  const {
    data: slots = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetClinicAvailableSlotsQuery(clinicId);

  const labelFor = (slot: (typeof slots)[number]) =>
    slot.time ??
    (slot.startTime && slot.endTime
      ? `${slot.startTime} – ${slot.endTime}`
      : slot.startTime ?? slot.date ?? "—");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-start">
          <h3 className="text-base font-semibold text-popover-foreground">
            {t("liveSlotsTitle")}
          </h3>
          <p className="text-sm text-muted-foreground">{t("liveSlotsDescription")}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
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

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t("loadingSlots")}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
          {t("slotsError")}
        </div>
      )}

      {!isLoading && !isError && slots.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t("noSlots")}
        </div>
      )}

      {!isLoading && !isError && slots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot, index) => {
            const available = slot.available !== false;
            return (
              <motion.button
                key={slot.id ?? `${labelFor(slot)}-${index}`}
                type="button"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  available
                    ? "border-teal-600/30 bg-teal-600/10 text-teal-800 hover:bg-teal-600/15 dark:text-teal-300"
                    : "border-border bg-muted text-muted-foreground line-through opacity-60",
                )}
                dir="ltr"
              >
                {labelFor(slot)}
                {slot.date && (
                  <span className="ms-2 text-xs opacity-70">{slot.date}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
