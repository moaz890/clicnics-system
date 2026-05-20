"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Link, useRouter } from "@/i18n/navigation";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetCodeMutation,
} from "@/features/auth/authApi";
import { resolveAuthFieldError } from "@/features/auth/lib/field-error";
import {
  buttonMotion,
  staggerContainer,
  staggerItem,
} from "@/features/auth/lib/auth-motion";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/forgotPasswordSchema";
import {
  resetOtpSchema,
  type ResetOtpFormValues,
} from "@/features/auth/schemas/resetOtpSchema";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/resetPasswordSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthFormInput } from "./AuthFormInput";
import { AuthTitle } from "./AuthTitle";

const RESEND_COOLDOWN_SECONDS = 59;
const OTP_LENGTH = 6;

type ForgotPasswordStep = "email" | "otp" | "password";

const REDIRECT_DELAY_MS = 1600;

const stepMotion = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35 },
};

function useResendCooldown(active: boolean) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const resetCooldown = useCallback(() => {
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
  }, []);

  useEffect(() => {
    if (!active) return;
    resetCooldown();
  }, [active, resetCooldown]);

  useEffect(() => {
    if (!active || secondsLeft <= 0) return;
    const timer = window.setTimeout(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [active, secondsLeft]);

  return {
    secondsLeft,
    canResend: secondsLeft <= 0,
    resetCooldown,
  };
}

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading: isSendingEmail, isError: isEmailError }] =
    useForgotPasswordMutation();
  const [
    verifyResetCode,
    { isLoading: isVerifying, isError: isVerifyError },
  ] = useVerifyResetCodeMutation();
  const [
    resetPassword,
    { isLoading: isResetting, isError: isResetError },
  ] = useResetPasswordMutation();

  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<ResetOtpFormValues>({
    resolver: zodResolver(resetOtpSchema),
    defaultValues: { code: "" },
  });

  const passwordForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "", newPassword: "", confirmPassword: "" },
  });

  const { secondsLeft, canResend, resetCooldown } = useResendCooldown(
    step === "otp",
  );

  const titleSubtitle =
    step === "email"
      ? t("resetPasswordDescription")
      : step === "otp"
        ? t("resetPasswordOtpDescription")
        : step === "password"
          ? t("resetPasswordFormDescription")
          : undefined;

  const sendCodeToEmail = async (targetEmail: string) => {
    await forgotPassword({ email: targetEmail }).unwrap();
  };

  const onEmailSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await sendCodeToEmail(values.email);
      setEmail(values.email);
      otpForm.reset({ code: "" });
      setStep("otp");
    } catch {
      /* isEmailError handles UI */
    }
  };

  const onOtpSubmit = async (values: ResetOtpFormValues) => {
    try {
      await verifyResetCode({ email, code: values.code }).unwrap();
      passwordForm.reset({
        email,
        newPassword: "",
        confirmPassword: "",
      });
      setStep("password");
    } catch {
      /* isVerifyError handles UI */
    }
  };

  const onPasswordSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        email: values.email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap();
      toast.success(t("resetPasswordSuccess"));
      window.setTimeout(() => {
        router.replace("/login");
      }, REDIRECT_DELAY_MS);
    } catch {
      /* isResetError handles UI */
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !email) return;
    try {
      await sendCodeToEmail(email);
      otpForm.reset({ code: "" });
      resetCooldown();
    } catch {
      /* isEmailError not shown on OTP step — could add toast later */
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    otpForm.reset({ code: "" });
    emailForm.setValue("email", email);
  };

  return (
    <>
      <AuthTitle subtitle={titleSubtitle}>{t("resetPasswordTitle")}</AuthTitle>

      <AnimatePresence mode="wait">
        {step === "email" && (
          <motion.div key="email" {...stepMotion}>
            <Form {...emailForm}>
              <motion.form
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-4"
                noValidate
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={staggerItem}>
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          {t("emailAddress")}
                        </FormLabel>
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
                            emailForm.formState.errors.email?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </motion.div>

                {isEmailError && (
                  <motion.p
                    role="alert"
                    variants={staggerItem}
                    className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {t("forgotPasswordError")}
                  </motion.p>
                )}

                <motion.div variants={staggerItem}>
                  <motion.div {...buttonMotion}>
                    <Button
                      type="submit"
                      disabled={isSendingEmail}
                      className="h-11 w-full cursor-pointer rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
                    >
                      {isSendingEmail && (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      )}
                      {t("sendResetLink")}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className="cursor-pointer font-medium text-primary transition-colors hover:text-teal-800 hover:underline"
              >
                {t("backToSignIn")}
              </Link>
            </p>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="otp" {...stepMotion}>
            <p className="mb-6 text-center text-sm text-muted-foreground">
              {t.rich("otpSentTo", {
                email,
                highlight: (chunks) => (
                  <span className="font-medium text-popover-foreground">
                    {chunks}
                  </span>
                ),
              })}
            </p>

            <Form {...otpForm}>
              <motion.form
                onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                className="space-y-6"
                noValidate
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={staggerItem} className="space-y-3">
                  <FormField
                    control={otpForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center gap-3">
                        <FormLabel className="sr-only">{t("verifyCode")}</FormLabel>
                        <FormControl>
                          <div
                            dir="ltr"
                            className="flex w-full justify-center"
                          >
                            <InputOTP
                              maxLength={OTP_LENGTH}
                              pattern={REGEXP_ONLY_DIGITS}
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              autoFocus
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              onComplete={() => {
                                if (isVerifying) return;
                                void otpForm.handleSubmit(onOtpSubmit)();
                              }}
                              containerClassName="justify-center"
                            >
                              <InputOTPGroup className="gap-2">
                                {Array.from({ length: OTP_LENGTH }).map(
                                  (_, index) => (
                                    <InputOTPSlot
                                      key={index}
                                      index={index}
                                      className="size-11 rounded-lg border-input text-base shadow-xs first:rounded-lg last:rounded-lg data-[active=true]:border-teal-700 data-[active=true]:ring-3 data-[active=true]:ring-teal-700/25"
                                    />
                                  ),
                                )}
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage className="text-center">
                          {resolveAuthFieldError(
                            t,
                            otpForm.formState.errors.code?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </motion.div>

                {isVerifyError && (
                  <motion.p
                    role="alert"
                    variants={staggerItem}
                    className="rounded-xl bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
                  >
                    {t("verifyResetCodeError")}
                  </motion.p>
                )}

                <motion.div variants={staggerItem} className="w-full">
                  <motion.div {...buttonMotion}>
                    <Button
                      type="submit"
                      disabled={isVerifying || otpForm.watch("code").length < OTP_LENGTH}
                      className="h-11 w-full cursor-pointer rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
                    >
                      {isVerifying && (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      )}
                      {t("verifyCode")}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </Form>

            <div className="mt-6 space-y-3 text-center text-sm">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSendingEmail}
                  className="cursor-pointer font-medium text-primary transition-colors hover:text-teal-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSendingEmail ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-3.5 animate-spin" aria-hidden />
                      {t("resendCode")}
                    </span>
                  ) : (
                    t("resendCode")
                  )}
                </button>
              ) : (
                <p className="text-muted-foreground">
                  {t("resendCodeIn", { seconds: secondsLeft })}
                </p>
              )}

              <p>
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="cursor-pointer font-medium text-muted-foreground transition-colors hover:text-popover-foreground hover:underline"
                >
                  {t("backToEmail")}
                </button>
              </p>

              <p className="text-muted-foreground">
                <Link
                  href="/login"
                  className="cursor-pointer font-medium text-primary transition-colors hover:text-teal-800 hover:underline"
                >
                  {t("backToSignIn")}
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {step === "password" && (
          <motion.div key="password" {...stepMotion}>
            <Form {...passwordForm}>
              <motion.form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
                noValidate
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={staggerItem}>
                  <FormField
                    control={passwordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          {t("emailAddress")}
                        </FormLabel>
                        <FormControl>
                          <AuthFormInput
                            {...field}
                            type="email"
                            icon="email"
                            readOnly
                            disabled
                            aria-readonly
                            className="cursor-default opacity-80"
                            placeholder={t("emailAddress")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
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
                            passwordForm.formState.errors.newPassword?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
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
                            passwordForm.formState.errors.confirmPassword
                              ?.message,
                          )}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </motion.div>

                {isResetError && (
                  <motion.p
                    role="alert"
                    variants={staggerItem}
                    className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {t("resetPasswordError")}
                  </motion.p>
                )}

                <motion.div variants={staggerItem}>
                  <motion.div {...buttonMotion}>
                    <Button
                      type="submit"
                      disabled={isResetting}
                      className="h-11 w-full cursor-pointer rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
                    >
                      {isResetting && (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      )}
                      {t("updatePassword")}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </Form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className="cursor-pointer font-medium text-primary transition-colors hover:text-teal-800 hover:underline"
              >
                {t("backToSignIn")}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
