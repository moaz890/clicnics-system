import { z } from "zod";
import { SLOT_DURATION_OPTIONS } from "../lib/constants";

const scheduleDaySchema = z
  .object({
    day: z.string(),
    enabled: z.boolean(),
    startTime: z.string().min(1, "startTimeRequired"),
    endTime: z.string().min(1, "endTimeRequired"),
  })
  .refine(
    (data) => !data.enabled || data.startTime < data.endTime,
    { message: "scheduleTimeOrder", path: ["endTime"] },
  );

export const clinicFormSchema = z.object({
  userId: z.string().min(1, "userIdRequired"),
  name: z.string().min(2, "nameMin"),
  address: z.string().min(3, "addressRequired"),
  phone: z.string().min(6, "phoneRequired"),
  location: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
  }),
  examinationFee: z.coerce.number().min(0, "feeMin"),
  slotDuration: z.coerce
    .number()
    .refine(
      (v) => SLOT_DURATION_OPTIONS.includes(v as (typeof SLOT_DURATION_OPTIONS)[number]),
      "slotDurationInvalid",
    ),
  schedules: z
    .array(scheduleDaySchema)
    .refine((days) => days.some((d) => d.enabled), "scheduleRequired"),
  isActive: z.boolean(),
});

export type ClinicFormValues = z.infer<typeof clinicFormSchema>;
