"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Link, useRouter } from "@/i18n/navigation";
import { useLoginMutation } from "@/features/auth/authApi";
import { resolveAuthFieldError } from "@/features/auth/lib/field-error";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import { AuthField } from "./AuthField";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTitle } from "./AuthTitle";
import { SocialAuthButtons } from "./SocialAuthButtons";

function resolveCallbackPath(raw: string | null): string {
  if (!raw) return "/dashboard";
  const stripped = raw.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  return stripped.startsWith("/") ? stripped : `/${stripped}`;
}

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [login, { isLoading, isError }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
      router.push(resolveCallbackPath(searchParams.get("callbackUrl")));
    } catch {
      /* isError handles UI */
    }
  };

  return (
    <>
      <AuthTitle subtitle={t("loginSubtitle")}>{t("welcomeBack")}</AuthTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AuthField
          {...register("email")}
          name="email"
          type="email"
          autoComplete="email"
          icon="email"
          label={t("email")}
          error={resolveAuthFieldError(t, errors.email?.message)}
          animationDelay={0.08}
        />

        <div className="space-y-1.5">
          <AuthField
            {...register("password")}
            name="password"
            type="password"
            autoComplete="current-password"
            icon="password"
            label={t("password")}
            error={resolveAuthFieldError(t, errors.password?.message)}
            animationDelay={0.14}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--design-primary)] transition-colors hover:text-[var(--design-primary-active)] hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
        </div>

        {isError && (
          <motion.p
            role="alert"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[var(--design-radius-md)] bg-[color-mix(in_srgb,var(--design-error)_12%,transparent)] px-3 py-2 text-sm text-[var(--design-error)]"
          >
            {t("loginError")}
          </motion.p>
        )}

        <AuthSubmitButton loading={isLoading}>{t("logIn")}</AuthSubmitButton>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-6 text-center text-sm text-[var(--design-body)]"
      >
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-[var(--design-primary)] transition-colors hover:text-[var(--design-primary-active)] hover:underline"
        >
          {t("signUp")}
        </Link>
      </motion.p>

      <SocialAuthButtons />
    </>
  );
}
