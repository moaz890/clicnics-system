"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useCreateAppointmentMutation } from "../appointmentsApi";
import { getSessionUserId } from "@/lib/auth/session";
import { useAppSelector } from "@/store/hooks";
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
import { Textarea } from "@/components/ui/textarea";
import { LtrText } from "@/components/ui/ltr-text";

export interface BookSlotSelection {
  clinicId: string;
  clinicName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  timeLabel: string;
  dateLabel: string;
}

interface BookSlotConfirmationDialogProps {
  selection: BookSlotSelection | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookSlotConfirmationDialog({
  selection,
  open,
  onOpenChange,
}: BookSlotConfirmationDialogProps) {
  const t = useTranslations("appointments");
  const reduxUserId = useAppSelector((state) => state.auth.user?.id);
  const patientId = getSessionUserId(reduxUserId);
  const [notes, setNotes] = useState("");
  const [createAppointment, { isLoading, isError }] =
    useCreateAppointmentMutation();

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setNotes("");
    }
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    if (!selection || !patientId) {
      toast.error(t("bookingSessionError"));
      return;
    }

    try {
      await createAppointment({
        clinicId: selection.clinicId,
        patientId,
        appointmentDate: selection.appointmentDate,
        startTime: selection.startTime,
        endTime: selection.endTime,
        notes: notes.trim() || undefined,
      }).unwrap();
      toast.success(t("bookingSuccess"));
      handleOpenChange(false);
    } catch {
      /* isError handles inline message */
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="rounded-xl sm:max-w-md">
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{t("bookSlotTitle")}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2 text-start">
            <span className="block">
              <span className="font-medium text-popover-foreground">
                {t("clinic")}:
              </span>{" "}
              {selection?.clinicName}
            </span>
            <span className="block">
              <span className="font-medium text-popover-foreground">
                {t("date")}:
              </span>{" "}
              {selection?.dateLabel}
            </span>
            <span className="block">
              <span className="font-medium text-popover-foreground">
                {t("time")}:
              </span>{" "}
              <LtrText>{selection?.timeLabel}</LtrText>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 text-start">
          <label
            htmlFor="booking-notes"
            className="text-sm font-medium text-popover-foreground"
          >
            {t("notesOptional")}
          </label>
          <Textarea
            id="booking-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("notesPlaceholder")}
            className="min-h-20 cursor-text resize-y rounded-xl"
          />
        </div>

        {isError ? (
          <p role="alert" className="text-sm text-destructive">
            {t("bookingError")}
          </p>
        ) : null}

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel className="cursor-pointer rounded-lg">
            {t("cancelAction")}
          </AlertDialogCancel>
          <Button
            disabled={isLoading || !selection}
            onClick={handleConfirm}
            className="cursor-pointer rounded-lg bg-primary text-primary-foreground hover:bg-[var(--design-primary-active)]"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {t("confirmBooking")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
