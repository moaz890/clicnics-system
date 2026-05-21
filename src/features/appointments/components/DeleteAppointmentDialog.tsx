"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDeleteAppointmentMutation } from "../appointmentsApi";
import { formatAppointmentTimeRange } from "../lib/normalize";
import type { Appointment } from "../types/appointment";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface DeleteAppointmentDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: DeleteAppointmentDialogProps) {
  const t = useTranslations("appointments");
  const [deleteAppointment, { isLoading }] = useDeleteAppointmentMutation();

  const handleDelete = async () => {
    if (!appointment) return;
    try {
      await deleteAppointment(appointment.id).unwrap();
      toast.success(t("deleteSuccess"));
      onOpenChange(false);
    } catch {
      toast.error(t("deleteError"));
    }
  };

  const label = appointment
    ? `${appointment.patientName ?? appointment.patientId} · ${appointment.appointmentDate} · ${formatAppointmentTimeRange(appointment)}`
    : t("thisAppointment");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteDescription", { label })}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="cursor-pointer rounded-lg">
            {t("cancelAction")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={handleDelete}
            className="cursor-pointer rounded-lg"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {t("confirmDelete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
