import { z } from "zod";
import { APPOINTMENT_STATUSES } from "../types/appointment";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const appointmentFormSchema = z
  .object({
    appointmentDate: z
      .string()
      .min(1, "dateRequired")
      .regex(datePattern, "dateInvalid"),
    startTime: z.string().min(1, "startTimeRequired"),
    endTime: z.string().min(1, "endTimeRequired"),
    notes: z.string().optional(),
    status: z.enum(APPOINTMENT_STATUSES).optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return data.endTime > data.startTime;
    },
    { message: "timeOrderInvalid", path: ["endTime"] },
  );

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
