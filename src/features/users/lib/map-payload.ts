import type { CreateUserPayload, UpdateUserPayload } from "../types/user";
import type {
  CreateUserFormValues,
  UpdateUserFormValues,
} from "../schemas/userFormSchema";

export function formValuesToCreatePayload(
  values: CreateUserFormValues,
): CreateUserPayload {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    password: values.password,
    phoneNumber: values.phoneNumber.trim(),
    role: values.role,
  };
}

export function formValuesToUpdatePayload(
  values: UpdateUserFormValues,
): UpdateUserPayload {
  const payload: UpdateUserPayload = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phoneNumber: values.phoneNumber.trim(),
  };

  if (values.role) {
    payload.role = values.role;
  }

  if (values.password?.trim()) {
    payload.password = values.password;
  }

  return payload;
}
