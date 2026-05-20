import { setRequestLocale } from "next-intl/server";
import { ClinicDetailView } from "@/features/clinics/components/ClinicDetailView";

export default async function ClinicDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ClinicDetailView clinicId={id} />;
}
