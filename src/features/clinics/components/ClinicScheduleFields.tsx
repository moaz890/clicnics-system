"use client";

import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolveClinicFieldError } from "../lib/field-error";
import { WEEK_DAYS } from "../lib/constants";
import type { ClinicFormValues } from "../schemas/clinicFormSchema";

export function ClinicScheduleFields() {
  const t = useTranslations("clinics");
  const {
    control,
    formState: { errors, isSubmitted },
  } = useFormContext<ClinicFormValues>();

  const scheduleRootError =
    typeof errors.schedules?.message === "string"
      ? errors.schedules.message
      : undefined;

  return (
    <div className="space-y-3">
      <Label className="text-start text-sm font-medium text-popover-foreground">
        {t("operationalSchedule")}
      </Label>
      {isSubmitted && scheduleRootError && (
        <p role="alert" className="text-sm text-destructive">
          {resolveClinicFieldError(t, scheduleRootError)}
        </p>
      )}
      <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
        {WEEK_DAYS.map((day, index) => (
          <Controller
            key={day.key}
            control={control}
            name={`schedules.${index}`}
            render={({ field }) => {
              const dayErrors = errors.schedules?.[index];
              const startTimeError =
                dayErrors &&
                typeof dayErrors === "object" &&
                "startTime" in dayErrors &&
                dayErrors.startTime &&
                typeof dayErrors.startTime === "object" &&
                "message" in dayErrors.startTime
                  ? String(dayErrors.startTime.message)
                  : undefined;
              const endTimeError =
                dayErrors &&
                typeof dayErrors === "object" &&
                "endTime" in dayErrors &&
                dayErrors.endTime &&
                typeof dayErrors.endTime === "object" &&
                "message" in dayErrors.endTime
                  ? String(dayErrors.endTime.message)
                  : undefined;

              return (
              <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-3 sm:min-w-36">
                  <Checkbox
                    checked={field.value.enabled}
                    onCheckedChange={(checked) =>
                      field.onChange({
                        ...field.value,
                        enabled: checked === true,
                      })
                    }
                    className="cursor-pointer"
                    aria-label={t(day.labelKey)}
                  />
                  <span className="text-sm font-medium text-popover-foreground">
                    {t(day.labelKey)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      {t("startTime")}
                    </span>
                    <Input
                      type="time"
                      value={field.value.startTime}
                      disabled={!field.value.enabled}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          startTime: e.target.value,
                        })
                      }
                      className="h-10 cursor-pointer rounded-lg"
                      aria-invalid={!!startTimeError}
                    />
                    {startTimeError && (
                      <p className="text-xs text-destructive">
                        {resolveClinicFieldError(t, startTimeError)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                      {t("endTime")}
                    </span>
                    <Input
                      type="time"
                      value={field.value.endTime}
                      disabled={!field.value.enabled}
                      onChange={(e) =>
                        field.onChange({
                          ...field.value,
                          endTime: e.target.value,
                        })
                      }
                      className="h-10 cursor-pointer rounded-lg"
                      aria-invalid={!!endTimeError}
                    />
                    {endTimeError && (
                      <p className="text-xs text-destructive">
                        {resolveClinicFieldError(t, endTimeError)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
            }}
          />
        ))}
      </div>
    </div>
  );
}
