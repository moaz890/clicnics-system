import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, "emailRequired")
      .email("emailInvalid"),
    newPassword: z
      .string()
      .min(8, "passwordMin")
      .regex(/[A-Z]/, "passwordUppercase")
      .regex(/[0-9]/, "passwordNumber"),
    confirmPassword: z.string().min(1, "confirmPasswordRequired"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
