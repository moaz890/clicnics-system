import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "firstNameRequired"),
    lastName: z.string().min(1, "lastNameRequired"),
    email: z
      .string()
      .min(1, "emailRequired")
      .email("emailInvalid"),
    phoneNumber: z.string().min(6, "phoneRequired"),
    password: z
      .string()
      .min(8, "passwordMin")
      .regex(/[A-Z]/, "passwordUppercase")
      .regex(/[0-9]/, "passwordNumber"),
    confirmPassword: z.string().min(1, "confirmPasswordRequired"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "termsRequired",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
