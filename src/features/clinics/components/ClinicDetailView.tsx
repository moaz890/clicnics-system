"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useGetClinicByIdQuery } from "../store/clinicsApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ClinicOverviewTab } from "./ClinicOverviewTab";
import { ClinicScheduleTab } from "./ClinicScheduleTab";
import { ClinicSlotsTab } from "./ClinicSlotsTab";
import { ClinicFormDialog } from "./ClinicFormDialog";
import { ClinicStatusBadge } from "./ClinicStatusBadge";

interface ClinicDetailViewProps {
  clinicId: string;
}

export function ClinicDetailView({ clinicId }: ClinicDetailViewProps) {
  const t = useTranslations("clinics");
  const { data: clinic, isLoading, isError } = useGetClinicByIdQuery(clinicId);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={t("loadingClinic")}
        className="space-y-4 p-6 sm:p-8"
      >
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !clinic) {
    return (
      <div className="p-6 sm:p-8">
        <p role="alert" className="text-sm text-destructive">
          {t("clinicNotFound")}
        </p>
        <Link
          href="/dashboard/clinics"
          className="mt-2 inline-flex cursor-pointer text-sm font-medium text-primary hover:underline"
        >
          {t("backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-6 dark:bg-slate-950 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3 text-start">
          <Link
            href="/dashboard/clinics"
            className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-popover-foreground"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            {t("backToList")}
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {clinic.name}
            </h1>
            <ClinicStatusBadge isActive={clinic.isActive} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {clinic.address}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setEditOpen(true)}
          className="cursor-pointer rounded-xl"
        >
          <Pencil className="size-4" aria-hidden />
          {t("editSettings")}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="gap-6">
        <TabsList
          variant="line"
          aria-label={t("pageTitle")}
          className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0"
        >
          <TabsTrigger value="overview" className="cursor-pointer px-4 py-2">
            {t("tabOverview")}
          </TabsTrigger>
          <TabsTrigger value="schedule" className="cursor-pointer px-4 py-2">
            {t("tabSchedule")}
          </TabsTrigger>
          <TabsTrigger value="slots" className="cursor-pointer px-4 py-2">
            {t("tabSlots")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 outline-none">
          <ClinicOverviewTab clinic={clinic} />
        </TabsContent>
        <TabsContent value="schedule" className="mt-0 outline-none">
          <ClinicScheduleTab clinic={clinic} />
        </TabsContent>
        <TabsContent value="slots" className="mt-0 outline-none">
          <ClinicSlotsTab clinicId={clinic.id} />
        </TabsContent>
      </Tabs>

      <ClinicFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        clinic={clinic}
      />
    </div>
  );
}
