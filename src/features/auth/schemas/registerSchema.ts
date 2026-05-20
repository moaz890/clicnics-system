import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "nameMin"),
    email: z
      .string()
      .min(1, "emailRequired")
      .email("emailInvalid"),
    password: z
      .string()
      .min(8, "passwordMin")
      .regex(/[A-Z]/, "passwordUppercase")
      .regex(/[0-9]/, "passwordNumber"),
    confirmPassword: z.string().min(1, "confirmPasswordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
