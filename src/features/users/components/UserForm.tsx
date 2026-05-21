"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../store/usersApi";
import {
  INTERNAL_USER_ROLES,
  USER_ROLE_LABEL_KEYS,
} from "../lib/constants";
import { resolveUserFieldError } from "../lib/field-error";
import {
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
} from "../lib/map-payload";
import {
  createUserFormSchema,
  updateUserFormSchema,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from "../schemas/userFormSchema";
import type { InternalUserRole, User } from "../types/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface UserFormProps {
  mode: "create" | "edit";
  user?: User;
  onSuccess?: () => void;
}

function buildCreateDefaults(): CreateUserFormValues {
  return {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "reception",
  };
}

function buildEditDefaults(user: User): UpdateUserFormValues {
  const role = (INTERNAL_USER_ROLES as readonly string[]).includes(user.role)
    ? (user.role as InternalUserRole)
    : "reception";

  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role,
    password: "",
    confirmPassword: "",
  };
}

export function UserForm({ mode, user, onSuccess }: UserFormProps) {
  const t = useTranslations("users");
  const [createUser, { isLoading: isCreating, isError: isCreateError }] =
    useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating, isError: isUpdateError }] =
    useUpdateUserMutation();

  const isEdit = mode === "edit";

  const form = useForm<CreateUserFormValues | UpdateUserFormValues>({
    resolver: zodResolver(isEdit ? updateUserFormSchema : createUserFormSchema),
    defaultValues: isEdit && user ? buildEditDefaults(user) : buildCreateDefaults(),
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(isEdit && user ? buildEditDefaults(user) : buildCreateDefaults());
  }, [user, isEdit, form]);

  const isLoading = isCreating || isUpdating;

  const onInvalid = () => {
    toast.error(t("formValidationSummary"));
  };

  const onSubmit = async (
    values: CreateUserFormValues | UpdateUserFormValues,
  ) => {
    try {
      if (mode === "create") {
        await createUser(
          formValuesToCreatePayload(values as CreateUserFormValues),
        ).unwrap();
        toast.success(t("createSuccess"));
      } else if (user) {
        const body = formValuesToUpdatePayload(values as UpdateUserFormValues);
        if (user.role === "patient") {
          delete body.role;
        }
        await updateUser({ id: user.id, body }).unwrap();
        toast.success(t("updateSuccess"));
      }
      onSuccess?.();
    } catch {
      /* mutation flags handle UI */
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">{t("firstName")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-11 cursor-text rounded-xl"
                    placeholder={t("firstNamePlaceholder")}
                  />
                </FormControl>
                <FormMessage>
                  {resolveUserFieldError(
                    t,
                    form.formState.errors.firstName?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">{t("lastName")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-11 cursor-text rounded-xl"
                    placeholder={t("lastNamePlaceholder")}
                  />
                </FormControl>
                <FormMessage>
                  {resolveUserFieldError(
                    t,
                    form.formState.errors.lastName?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-start">{t("email")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  autoComplete="email"
                  className="h-11 cursor-text rounded-xl"
                  placeholder={t("emailPlaceholder")}
                />
              </FormControl>
              <FormMessage>
                {resolveUserFieldError(t, form.formState.errors.email?.message)}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-start">{t("phoneNumber")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  dir="ltr"
                  className="h-11 cursor-text rounded-xl text-start"
                  placeholder={t("phonePlaceholder")}
                />
              </FormControl>
              <FormMessage>
                {resolveUserFieldError(
                  t,
                  form.formState.errors.phoneNumber?.message,
                )}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-start">{t("role")}</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isEdit && user?.role === "patient"}
              >
                <FormControl>
                  <SelectTrigger className="h-11 w-full cursor-pointer rounded-xl">
                    <SelectValue placeholder={t("rolePlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INTERNAL_USER_ROLES.map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                      className="cursor-pointer"
                    >
                      {t(USER_ROLE_LABEL_KEYS[role])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isEdit && user?.role === "patient" ? (
                <p className="text-xs text-muted-foreground">
                  {t("patientRoleLocked")}
                </p>
              ) : null}
              <FormMessage>
                {resolveUserFieldError(t, form.formState.errors.role?.message)}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">
                  {isEdit ? t("passwordOptional") : t("password")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete={isEdit ? "new-password" : "new-password"}
                    className="h-11 cursor-text rounded-xl"
                    placeholder={
                      isEdit ? t("passwordOptionalPlaceholder") : undefined
                    }
                  />
                </FormControl>
                <FormMessage>
                  {resolveUserFieldError(
                    t,
                    form.formState.errors.password?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start">
                  {isEdit ? t("confirmPasswordOptional") : t("confirmPassword")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    className="h-11 cursor-text rounded-xl"
                  />
                </FormControl>
                <FormMessage>
                  {resolveUserFieldError(
                    t,
                    form.formState.errors.confirmPassword?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        {(isCreateError || isUpdateError) && (
          <p role="alert" className="text-sm text-destructive">
            {mode === "create" ? t("createError") : t("updateError")}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer rounded-xl bg-primary text-primary-foreground hover:bg-[var(--design-primary-active)]"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {mode === "create" ? t("createAccount") : t("saveChanges")}
        </Button>
      </form>
    </Form>
  );
}
