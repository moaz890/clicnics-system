"use client";

import { useTranslations } from "next-intl";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileSettingsPlaceholder } from "./ProfileSettingsPlaceholder";

const TAB_ACCOUNT = "account";
const TAB_SECURITY = "security";
const TAB_NOTIFICATIONS = "notifications";
const TAB_CLINIC = "clinic";

export function ProfileSettingsTabs() {
  const t = useTranslations("profile");

  return (
    <Tabs
      defaultValue={TAB_SECURITY}
      orientation="vertical"
      className="flex flex-col gap-6 md:flex-row md:gap-8"
    >
      <TabsList
        variant="line"
        className="h-auto w-full shrink-0 flex-row justify-start gap-1 overflow-x-auto bg-transparent p-0 md:w-56 md:flex-col md:items-stretch md:overflow-visible"
      >
        <TabsTrigger
          value={TAB_ACCOUNT}
          className="cursor-pointer justify-start px-3 py-2.5"
        >
          {t("tabAccount")}
        </TabsTrigger>
        <TabsTrigger
          value={TAB_SECURITY}
          className="cursor-pointer justify-start px-3 py-2.5"
        >
          {t("tabSecurity")}
        </TabsTrigger>
        <TabsTrigger
          value={TAB_NOTIFICATIONS}
          className="cursor-pointer justify-start px-3 py-2.5"
        >
          {t("tabNotifications")}
        </TabsTrigger>
        <TabsTrigger
          value={TAB_CLINIC}
          className="cursor-pointer justify-start px-3 py-2.5"
        >
          {t("tabClinic")}
        </TabsTrigger>
      </TabsList>

      <div className="min-w-0 flex-1">
        <TabsContent value={TAB_ACCOUNT} className="mt-0 outline-none">
          <ProfileSettingsPlaceholder
            title={t("accountPlaceholderTitle")}
            description={t("accountPlaceholderDescription")}
          />
        </TabsContent>

        <TabsContent value={TAB_SECURITY} className="mt-0 outline-none">
          <Card>
            <CardContent className="pt-6">
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={TAB_NOTIFICATIONS} className="mt-0 outline-none">
          <ProfileSettingsPlaceholder
            title={t("notificationsPlaceholderTitle")}
            description={t("notificationsPlaceholderDescription")}
          />
        </TabsContent>

        <TabsContent value={TAB_CLINIC} className="mt-0 outline-none">
          <ProfileSettingsPlaceholder
            title={t("clinicPlaceholderTitle")}
            description={t("clinicPlaceholderDescription")}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
