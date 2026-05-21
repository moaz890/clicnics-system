import { setRequestLocale } from "next-intl/server";
import { AppointmentsManagementPage } from "@/features/appointments/components/AppointmentsManagementPage";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AppointmentsManagementPage />;
}
