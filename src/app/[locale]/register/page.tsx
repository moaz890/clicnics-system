import { setRequestLocale } from "next-intl/server";
import { AuthSplitLayout } from "@/features/auth/components/AuthSplitLayout";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AuthSplitLayout>
      <RegisterForm />
    </AuthSplitLayout>
  );
}
