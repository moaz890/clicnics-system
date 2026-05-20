import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { AuthTitle } from "@/features/auth/components/AuthTitle";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <AuthSplitLayout>
      <AuthTitle subtitle={t("forgotPassword")}>{t("welcomeBack")}</AuthTitle>
      <p className="text-sm text-[oklch(0.48_0.03_255)]">
        Password reset flow coming soon.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block text-sm font-medium text-[var(--auth-teal)] hover:underline"
      >
        {t("logIn")}
      </Link>
    </AuthSplitLayout>
  );
}
