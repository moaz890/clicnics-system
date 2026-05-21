import { setRequestLocale } from "next-intl/server";
import { UsersManagementPage } from "@/features/users/components/UsersManagementPage";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <UsersManagementPage />;
}
