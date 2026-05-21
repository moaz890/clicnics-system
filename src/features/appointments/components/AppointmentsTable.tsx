"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatAppointmentTimeRange } from "../lib/normalize";
import type { Appointment } from "../types/appointment";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { LtrText } from "@/components/ui/ltr-text";
import { cn } from "@/lib/utils";

interface AppointmentsTableProps {
  appointments: Appointment[];
  isLoading: boolean;
  isError: boolean;
  canManage: boolean;
  onEdit: (appointmentId: string) => void;
  onDelete: (appointment: Appointment) => void;
}

export function AppointmentsTable({
  appointments,
  isLoading,
  isError,
  canManage,
  onEdit,
  onDelete,
}: AppointmentsTableProps) {
  const t = useTranslations("appointments");

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-card p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive"
      >
        {t("loadError")}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">{t("emptyState")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <caption className="sr-only">{t("tableCaption")}</caption>
        <TableHeader>
          <TableRow className="cursor-default hover:bg-transparent">
            <TableHead scope="col" className="cursor-default text-start">
              {t("patient")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("clinic")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("date")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("time")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("status")}
            </TableHead>
            {canManage ? (
              <TableHead scope="col" className="w-12 cursor-default text-end">
                <span className="sr-only">{t("actions")}</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => {
            const patientLabel =
              appointment.patientName ?? appointment.patientId;
            const clinicLabel = appointment.clinicName ?? appointment.clinicId;

            return (
              <TableRow
                key={appointment.id}
                className={cn(
                  "cursor-default transition-colors hover:bg-muted/40",
                )}
              >
                <TableCell className="font-medium text-popover-foreground">
                  {patientLabel}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/dashboard/clinics/${appointment.clinicId}`}
                    className="cursor-pointer text-start text-primary hover:underline"
                  >
                    {clinicLabel}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <LtrText>{appointment.appointmentDate}</LtrText>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <LtrText>{formatAppointmentTimeRange(appointment)}</LtrText>
                </TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={appointment.status} />
                </TableCell>
                {canManage ? (
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-popover-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        aria-label={t("openActions", {
                          name: patientLabel,
                        })}
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-44">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onEdit(appointment.id)}
                          >
                            {t("editAppointment")}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => onDelete(appointment)}
                          >
                            {t("deleteAppointment")}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                ) : null}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
