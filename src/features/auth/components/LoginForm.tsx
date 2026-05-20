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
  staggerContainer,
  staggerItem,
} from "@/features/auth/lib/auth-motion";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
      const destination = resolveCallbackPath(searchParams.get("callbackUrl"));
      router.replace(destination);
    } catch {
      /* isError handles UI */
    }
  };

  return (
    <>
      <AuthTitle>{t("welcomeBack")}</AuthTitle>

      <Form {...form}>
        <motion.form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={staggerItem}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("emailAddress")}</FormLabel>
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

          <motion.div variants={staggerItem} className="space-y-1.5">
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
                      autoComplete="current-password"
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
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="cursor-pointer text-sm text-primary transition-colors hover:text-teal-800 hover:underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>
          </motion.div>

          {isError && (
            <motion.p
              role="alert"
              variants={staggerItem}
              className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {t("loginError")}
            </motion.p>
          )}

          <AuthSubmitButton loading={isLoading}>{t("signIn")}</AuthSubmitButton>
        </motion.form>
      </Form>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mt-6 text-center text-sm text-muted-foreground"
      >
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="cursor-pointer font-semibold text-primary transition-colors hover:text-teal-800 hover:underline"
        >
          {t("signUp")}
        </Link>
      </motion.p>

      <SocialAuthButtons />
    </>
  );
}
