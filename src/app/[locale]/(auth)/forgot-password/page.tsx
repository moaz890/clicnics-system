import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
