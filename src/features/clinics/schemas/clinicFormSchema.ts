import { z } from "zod";
import { SLOT_DURATION_OPTIONS } from "../lib/constants";

const finiteNumber = (message: string) =>
  z.number().refine((n) => Number.isFinite(n), message);

const scheduleDaySchema = z
  .object({
    day: z.string(),
    enabled: z.boolean(),
    startTime: z.string(),
    endTime: z.string(),
  })
  .superRefine((data, ctx) => {
    if (!data.enabled) {
      return;
    }
    if (!data.startTime.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "startTimeRequired",
        path: ["startTime"],
      });
    }
    if (!data.endTime.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "endTimeRequired",
        path: ["endTime"],
      });
    }
    if (
      data.startTime.trim() &&
      data.endTime.trim() &&
      data.startTime >= data.endTime
    ) {
      ctx.addIssue({
        code: "custom",
        message: "scheduleTimeOrder",
        path: ["endTime"],
      });
    }
  });

export const clinicFormSchema = z.object({
  userId: z.string().min(1, "userIdRequired"),
  name: z.string().min(2, "nameMin"),
  address: z.string().min(3, "addressRequired"),
  phone: z.string().min(6, "phoneRequired"),
  location: z.object({
    lat: finiteNumber("latitudeInvalid"),
    lng: finiteNumber("longitudeInvalid"),
  }),
  examinationFee: finiteNumber("feeMin").refine((n) => n >= 0, "feeMin"),
  slotDuration: z
    .number()
    .refine(
      (v) =>
        SLOT_DURATION_OPTIONS.includes(
          v as (typeof SLOT_DURATION_OPTIONS)[number],
        ),
      "slotDurationInvalid",
    ),
  schedules: z
    .array(scheduleDaySchema)
    .refine((days) => days.some((d) => d.enabled), "scheduleRequired"),
  isActive: z.boolean(),
});

export type ClinicFormValues = z.infer<typeof clinicFormSchema>;
