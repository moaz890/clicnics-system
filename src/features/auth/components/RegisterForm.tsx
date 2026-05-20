"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { useRegisterMutation } from "@/features/auth/authApi";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/registerSchema";
import { AuthField } from "./AuthField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { resolveAuthFieldError } from "@/features/auth/lib/field-error";
import { AuthTitle } from "./AuthTitle";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [registerUser, { isLoading, isError }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        name: values.name,
        email: values.email,
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
      <AuthTitle>{t("createAccount")}</AuthTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AuthField
          {...register("name")}
          name="name"
          type="text"
          autoComplete="name"
          icon="user"
          label={t("name")}
          error={resolveAuthFieldError(t, errors.name?.message)}
          animationDelay={0.06}
        />

        <AuthField
          {...register("email")}
          name="email"
          type="email"
          autoComplete="email"
          icon="email"
          label={t("email")}
          error={resolveAuthFieldError(t, errors.email?.message)}
          animationDelay={0.1}
        />

        <AuthField
          {...register("password")}
          name="password"
          type="password"
          autoComplete="new-password"
          icon="password"
          label={t("password")}
          error={resolveAuthFieldError(t, errors.password?.message)}
          animationDelay={0.14}
        />

        <AuthField
          {...register("confirmPassword")}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          icon="password"
          label={t("confirmPassword")}
          error={resolveAuthFieldError(t, errors.confirmPassword?.message)}
          animationDelay={0.18}
        />

        {isError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[var(--design-radius-md)] bg-[color-mix(in_srgb,var(--design-error)_12%,transparent)] px-3 py-2 text-sm text-[var(--design-error)]"
          >
            {t("registerError")}
          </motion.p>
        )}

        <AuthSubmitButton loading={isLoading}>{t("register")}</AuthSubmitButton>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-6 text-center text-sm text-[var(--design-body)]"
      >
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-[var(--design-primary)] transition-colors hover:text-[var(--design-primary-active)] hover:underline"
        >
          {t("logIn")}
        </Link>
      </motion.p>
    </>
  );
}
