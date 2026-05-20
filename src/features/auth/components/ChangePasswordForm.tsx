"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/features/auth/authApi";
import { resolveAuthFieldError } from "@/features/auth/lib/field-error";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas/changePasswordSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthFormInput } from "./AuthFormInput";

export function ChangePasswordForm() {
  const t = useTranslations("auth");
  const tProfile = useTranslations("profile");
  const [changePassword, { isLoading, isError }] = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword(values).unwrap();
      toast.success(tProfile("changePasswordSuccess"));
      form.reset({
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      /* isError handles UI */
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-start">
        <h2 className="text-lg font-semibold text-popover-foreground">
          {tProfile("securityTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {tProfile("securityDescription")}
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start text-popover-foreground">
                  {tProfile("currentPassword")}
                </FormLabel>
                <FormControl>
                  <AuthFormInput
                    {...field}
                    type="password"
                    autoComplete="current-password"
                    icon="password"
                    placeholder={tProfile("currentPassword")}
                  />
                </FormControl>
                <FormMessage>
                  {resolveAuthFieldError(
                    t,
                    form.formState.errors.password?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-start text-popover-foreground">
                  {t("newPassword")}
                </FormLabel>
                <FormControl>
                  <AuthFormInput
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    icon="password"
                    placeholder={t("newPassword")}
                  />
                </FormControl>
                <FormMessage>
                  {resolveAuthFieldError(
                    t,
                    form.formState.errors.newPassword?.message,
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
                <FormLabel className="text-start text-popover-foreground">
                  {t("confirmNewPassword")}
                </FormLabel>
                <FormControl>
                  <AuthFormInput
                    {...field}
                    type="password"
                    autoComplete="new-password"
                    icon="password"
                    placeholder={t("confirmNewPassword")}
                  />
                </FormControl>
                <FormMessage>
                  {resolveAuthFieldError(
                    t,
                    form.formState.errors.confirmPassword?.message,
                  )}
                </FormMessage>
              </FormItem>
            )}
          />

          {isError && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {tProfile("changePasswordError")}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 min-w-40 cursor-pointer rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white hover:bg-teal-800"
            >
              {isLoading && (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              )}
              {tProfile("saveChanges")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
