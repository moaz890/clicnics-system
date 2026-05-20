import { z } from "zod";

export const resetOtpSchema = z.object({
  code: z
    .string()
    .length(6, "otpLength")
    .regex(/^\d{6}$/, "otpInvalid"),
});

export type ResetOtpFormValues = z.infer<typeof resetOtpSchema>;
