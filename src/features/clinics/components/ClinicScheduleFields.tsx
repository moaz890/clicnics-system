"use client";

import { useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WEEK_DAYS } from "../lib/constants";
import type { ClinicFormValues } from "../schemas/clinicFormSchema";

export function ClinicScheduleFields() {
  const t = useTranslations("clinics");
  const { control } = useFormContext<ClinicFormValues>();

  return (
    <div className="space-y-3">
      <Label className="text-start text-sm font-medium text-popover-foreground">
        {t("operationalSchedule")}
      </Label>
      <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-3">
        {WEEK_DAYS.map((day, index) => (
          <Controller
            key={day.key}
            control={control}
            name={`schedules.${index}`}
            render={({ field }) => (
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
                    />
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
                    />
                  </div>
                </div>
              </div>
            )}
          />
        ))}
      </div>
    </div>
  );
}
