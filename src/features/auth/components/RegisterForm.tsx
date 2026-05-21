"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { useRegisterMutation } from "@/features/auth/authApi";
import { resolveAuthFieldError } from "@/features/auth/lib/field-error";
import {
  staggerContainer,
  staggerItem,
} from "@/features/auth/lib/auth-motion";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/registerSchema";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthFormInput } from "./AuthFormInput";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTitle } from "./AuthTitle";
import { SocialAuthButtons } from "./SocialAuthButtons";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [registerUser, { isLoading, isError }] = useRegisterMutation();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        confirmPassword: values.confirmPassword,
      }).unwrap();
      router.push("/dashboard");
    } catch {
      /* isError handles UI */
    }
  };

  return (
    <>
      <AuthTitle>{t("createSecureAccount")}</AuthTitle>

      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div variants={staggerItem}>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-start">{t("firstName")}</FormLabel>
                    <FormControl>
                      <AuthFormInput
                        {...field}
                        type="text"
                        autoComplete="given-name"
                        icon="user"
                        placeholder={t("firstNamePlaceholder")}
                      />
                    </FormControl>
                    <FormMessage>
                      {resolveAuthFieldError(
                        t,
                        form.formState.errors.firstName?.message,
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-start">{t("lastName")}</FormLabel>
                    <FormControl>
                      <AuthFormInput
                        {...field}
                        type="text"
                        autoComplete="family-name"
                        icon="user"
                        placeholder={t("lastNamePlaceholder")}
                      />
                    </FormControl>
                    <FormMessage>
                      {resolveAuthFieldError(
                        t,
                        form.formState.errors.lastName?.message,
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </motion.div>
          </div>

          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-start">{t("emailAddress")}</FormLabel>
                  <FormControl>
                    <AuthFormInput
                      {...field}
                      type="email"
                      autoComplete="email"
                      icon="email"
                      placeholder={t("emailAddress")}
                    />
                  </FormControl>
                  <FormMessage>
                    {resolveAuthFieldError(
                      t,
                      form.formState.errors.email?.message,
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-start">{t("phoneNumber")}</FormLabel>
                  <FormControl>
                    <AuthFormInput
                      {...field}
                      type="tel"
                      autoComplete="tel"
                      icon="user"
                      placeholder={t("phonePlaceholder")}
                      className="text-start"
                      dir="ltr"
                    />
                  </FormControl>
                  <FormMessage>
                    {resolveAuthFieldError(
                      t,
                      form.formState.errors.phoneNumber?.message,
                    )}
                  </FormMessage>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">{t("password")}</FormLabel>
                  <FormControl>
                    <AuthFormInput
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      icon="password"
                      placeholder={t("password")}
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
          </motion.div>

          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <AuthFormInput
                      {...field}
                      type="password"
                      autoComplete="new-password"
                      icon="password"
                      placeholder={t("confirmPassword")}
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
          </motion.div>

          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                      className="mt-0.5 cursor-pointer"
                      aria-invalid={Boolean(form.formState.errors.acceptTerms)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground">
                      {t("termsPrefix")}{" "}
                      <Link
                        href="/terms"
                        className="cursor-pointer font-medium text-primary transition-colors hover:text-[var(--design-primary-active)] hover:underline"
                      >
                        {t("termsLink")}
                      </Link>
                    </FormLabel>
                    <FormMessage>
                      {resolveAuthFieldError(
                        t,
                        form.formState.errors.acceptTerms?.message,
                      )}
                    </FormMessage>
                  </div>
                </FormItem>
              )}
            />
          </motion.div>

          {isError && (
            <motion.p
              role="alert"
              variants={staggerItem}
              className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {t("registerError")}
            </motion.p>
          )}

          <AuthSubmitButton loading={isLoading}>{t("register")}</AuthSubmitButton>
        </motion.form>
      </Form>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 text-center text-sm text-muted-foreground"
      >
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="cursor-pointer font-semibold text-primary transition-colors hover:text-[var(--design-primary-active)] hover:underline"
        >
          {t("signIn")}
        </Link>
      </motion.p>

      <SocialAuthButtons />
    </>
  );
}
