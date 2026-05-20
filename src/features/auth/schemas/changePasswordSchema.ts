import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, "passwordRequired"),
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
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "newPasswordSameAsCurrent",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
