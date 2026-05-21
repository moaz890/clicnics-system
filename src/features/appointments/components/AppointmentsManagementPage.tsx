"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAppointmentsQuery } from "../appointmentsApi";
import { isPatientRole } from "../lib/roles";
import type { Appointment, AppointmentStatus } from "../types/appointment";
import { APPOINTMENT_STATUSES } from "../types/appointment";
import { useGetClinicsQuery } from "@/features/clinics/store/clinicsApi";
import { useGetUsersQuery } from "@/features/users/store/usersApi";
import { getUserFullName } from "@/features/users/lib/normalize";
import { useIsAdmin } from "@/features/auth/hooks/useIsAdmin";
import { useUserRole } from "@/features/auth/hooks/useUserRole";
import { getSessionUserId } from "@/lib/auth/session";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTable } from "./AppointmentsTable";
import { EditAppointmentDialog } from "./EditAppointmentDialog";
import { DeleteAppointmentDialog } from "./DeleteAppointmentDialog";

type StatusFilter = AppointmentStatus | "all";

const STATUS_FILTER_KEYS: Record<StatusFilter, string> = {
  all: "filterAll",
  scheduled: "filterScheduled",
  completed: "filterCompleted",
  cancelled: "filterCancelled",
};

function enrichAppointment(
  appointment: Appointment,
  clinicNames: Map<string, string>,
  patientNames: Map<string, string>,
): Appointment {
  return {
    ...appointment,
    clinicName:
      appointment.clinicName ?? clinicNames.get(appointment.clinicId),
    patientName:
      appointment.patientName ?? patientNames.get(appointment.patientId),
  };
}

export function AppointmentsManagementPage() {
  const t = useTranslations("appointments");
  const isAdmin = useIsAdmin();
  const role = useUserRole();
  const reduxUserId = useAppSelector((state) => state.auth.user?.id);
  const authUserId = getSessionUserId(reduxUserId);
  const reduceMotion = useReducedMotion();

  const { data: appointments = [], isLoading, isError } = useGetAppointmentsQuery();
  const { data: clinics = [] } = useGetClinicsQuery();
  const { data: users = [] } = useGetUsersQuery(undefined, { skip: !isAdmin });

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  const clinicNames = useMemo(
    () => new Map(clinics.map((c) => [c.id, c.name])),
    [clinics],
  );

  const patientNames = useMemo(
    () =>
      new Map(
        users.map((u) => [u.id, getUserFullName(u) || u.email || u.id]),
      ),
    [users],
  );

  const enriched = useMemo(
    () =>
      appointments.map((a) => enrichAppointment(a, clinicNames, patientNames)),
    [appointments, clinicNames, patientNames],
  );

  const scoped = useMemo(() => {
    if (isAdmin || !isPatientRole(role)) {
      return enriched;
    }
    return enriched.filter((a) => a.patientId === authUserId);
  }, [enriched, isAdmin, role, authUserId]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return scoped;
    return scoped.filter((a) => a.status === statusFilter);
  }, [scoped, statusFilter]);

  const counts = useMemo(
    () => ({
      total: scoped.length,
      scheduled: scoped.filter((a) => a.status === "scheduled").length,
      completed: scoped.filter((a) => a.status === "completed").length,
      cancelled: scoped.filter((a) => a.status === "cancelled").length,
    }),
    [scoped],
  );

  const pageSubtitle = isAdmin
    ? t("pageSubtitleAdmin")
    : isPatientRole(role)
      ? t("pageSubtitlePatient")
      : t("pageSubtitleStaff");

  const openEdit = (id: string) => {
    setEditId(id);
    setEditOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 bg-background p-6 sm:p-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 text-start"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {isPatientRole(role) && !isAdmin
            ? t("pageTitlePatient")
            : t("pageTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{pageSubtitle}</p>
      </motion.header>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.05 }}
      >
        <Card className="border-border/80 bg-card shadow-sm">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarCheck className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-base font-semibold text-popover-foreground">
                {t("summaryTitle")}
              </CardTitle>
            </div>
            <div className="flex flex-wrap gap-4 text-sm tabular-nums">
              <span className="text-muted-foreground">
                {t("countTotal")}:{" "}
                <strong className="text-foreground">{counts.total}</strong>
              </span>
              <span className="text-[var(--design-accent-teal)]">
                {t("countScheduled")}: {counts.scheduled}
              </span>
              <span className="text-[var(--design-success)]">
                {t("countCompleted")}: {counts.completed}
              </span>
              <span className="text-muted-foreground">
                {t("countCancelled")}: {counts.cancelled}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-muted-foreground">{t("summaryHint")}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.08 }}
      >
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <TabsList
            variant="line"
            aria-label={t("filterByStatus")}
            className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0"
          >
            {(["all", ...APPOINTMENT_STATUSES] as StatusFilter[]).map((status) => (
              <TabsTrigger
                key={status}
                value={status}
                className="cursor-pointer px-4 py-2"
              >
                {t(STATUS_FILTER_KEYS[status])}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={reduceMotion ? false : { opacity: 1, y: 0 }}
        transition={reduceMotion ? undefined : { delay: 0.1 }}
      >
        <AppointmentsTable
          appointments={filtered}
          isLoading={isLoading}
          isError={isError}
          canManage={isAdmin}
          onEdit={openEdit}
          onDelete={(appointment) => setDeleteTarget(appointment)}
        />
      </motion.div>

      {isAdmin ? (
        <>
          <EditAppointmentDialog
            appointmentId={editId}
            open={editOpen}
            onOpenChange={(open) => {
              setEditOpen(open);
              if (!open) setEditId(null);
            }}
          />

          <DeleteAppointmentDialog
            appointment={deleteTarget}
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => {
              if (!open) setDeleteTarget(null);
            }}
          />
        </>
      ) : null}
    </div>
  );
}
