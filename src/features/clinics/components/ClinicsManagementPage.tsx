"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useGetClinicByIdQuery,
  useGetClinicsQuery,
} from "../store/clinicsApi";
import type { ClinicListItem } from "../types/clinic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClinicsTable } from "./ClinicsTable";
import { ClinicFormDialog } from "./ClinicFormDialog";
import { DeleteClinicDialog } from "./DeleteClinicDialog";

export function ClinicsManagementPage() {
  const t = useTranslations("clinics");
  const { data: clinics = [] } = useGetClinicsQuery();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editClinicId, setEditClinicId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ClinicListItem | null>(null);

  const { data: editClinic } = useGetClinicByIdQuery(editClinicId ?? "", {
    skip: !editClinicId || !formOpen || formMode !== "edit",
  });

  const activeCount = useMemo(
    () => clinics.filter((c) => c.isActive).length,
    [clinics],
  );

  const openCreate = () => {
    setFormMode("create");
    setEditClinicId(null);
    setFormOpen(true);
  };

  const openEdit = (id: string) => {
    setFormMode("edit");
    setEditClinicId(id);
    setFormOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-6 dark:bg-slate-950 sm:p-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1 text-start">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t("pageTitle")}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("pageSubtitle")}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="cursor-pointer rounded-xl bg-teal-700 shadow-sm hover:bg-teal-800"
        >
          <Plus className="size-4" aria-hidden />
          {t("addClinic")}
        </Button>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-teal-700/10 text-teal-700">
                <Building2 className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-base font-semibold text-popover-foreground">
                {t("totalActiveClinics")}
              </CardTitle>
            </div>
            <p className="text-2xl font-bold tabular-nums text-teal-700">
              {activeCount}
              <span className="ms-1 text-sm font-normal text-muted-foreground">
                / {clinics.length}
              </span>
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">{t("totalActiveHint")}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ClinicsTable
          onEdit={openEdit}
          onDelete={(clinic) => setDeleteTarget(clinic)}
        />
      </motion.div>

      <ClinicFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        clinic={formMode === "edit" ? editClinic : undefined}
      />

      <DeleteClinicDialog
        open={Boolean(deleteTarget)}
        clinicId={deleteTarget?.id ?? null}
        clinicName={deleteTarget?.name}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
