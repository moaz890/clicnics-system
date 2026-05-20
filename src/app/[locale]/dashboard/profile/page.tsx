import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileSettingsTabs } from "@/features/profile/components/ProfileSettingsTabs";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("profile");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-8 sm:px-8">
      <header className="mb-8 space-y-1 text-start">
        <h1 className="text-2xl font-bold tracking-tight text-popover-foreground">
          {t("settingsTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("settingsSubtitle")}</p>
      </header>

      <ProfileSettingsTabs />
    </main>
  );
}
