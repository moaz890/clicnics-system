import { setRequestLocale } from "next-intl/server";
import { ClinicsManagementPage } from "@/features/clinics/components/ClinicsManagementPage";

export default async function ClinicsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ClinicsManagementPage />;
}
