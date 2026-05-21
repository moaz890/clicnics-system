import { z } from "zod";
import { INTERNAL_USER_ROLES } from "../types/user";

const passwordField = z
  .string()
  .min(8, "passwordMin")
  .regex(/[A-Z]/, "passwordUppercase")
  .regex(/[0-9]/, "passwordNumber");

const baseFields = {
  firstName: z.string().min(1, "firstNameRequired"),
  lastName: z.string().min(1, "lastNameRequired"),
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
  phoneNumber: z.string().min(6, "phoneRequired"),
  role: z.enum(INTERNAL_USER_ROLES, { message: "roleRequired" }),
};

export const createUserFormSchema = z
  .object({
    ...baseFields,
    password: passwordField,
    confirmPassword: z.string().min(1, "confirmPasswordRequired"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordMismatch",
    path: ["confirmPassword"],
  });

export const updateUserFormSchema = z
  .object({
    ...baseFields,
    password: z.union([z.literal(""), passwordField]).optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasPassword = Boolean(data.password?.trim());
    const hasConfirm = Boolean(data.confirmPassword?.trim());

    if (hasPassword || hasConfirm) {
      if (!hasPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "passwordRequired",
          path: ["password"],
        });
      }
      if (!hasConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "confirmPasswordRequired",
          path: ["confirmPassword"],
        });
      }
      if (hasPassword && hasConfirm && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "passwordMismatch",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;
export type UserFormValues = CreateUserFormValues;
