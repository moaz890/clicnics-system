"use client";

import { useTranslations } from "next-intl";
import type { Clinic } from "../types/clinic";
import { ClinicStatusBadge } from "./ClinicStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ClinicOverviewTab({ clinic }: { clinic: Clinic }) {
  const t = useTranslations("clinics");

  const items = [
    { label: t("name"), value: clinic.name },
    { label: t("address"), value: clinic.address },
    { label: t("phone"), value: clinic.phone, dir: "ltr" as const },
    {
      label: t("examinationFee"),
      value: t("feeDisplay", { amount: clinic.examinationFee }),
    },
    {
      label: t("slotDuration"),
      value: t("minutes", { count: clinic.slotDuration }),
    },
    {
      label: t("coordinates"),
      value: `${clinic.location.lat}, ${clinic.location.lng}`,
      dir: "ltr" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-border/80 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-start text-base">
            {t("overviewMetadata")}
          </CardTitle>
          <ClinicStatusBadge isActive={clinic.isActive} />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="space-y-1 text-start">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <p
                className="text-sm font-medium text-popover-foreground"
                dir={item.dir}
              >
                {item.value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
