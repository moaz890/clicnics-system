"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDeleteClinicMutation } from "../store/clinicsApi";
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

interface DeleteClinicDialogProps {
  clinicId: string | null;
  clinicName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteClinicDialog({
  clinicId,
  clinicName,
  open,
  onOpenChange,
}: DeleteClinicDialogProps) {
  const t = useTranslations("clinics");
  const [deleteClinic, { isLoading }] = useDeleteClinicMutation();

  const handleDelete = async () => {
    if (!clinicId) return;
    try {
      await deleteClinic(clinicId).unwrap();
      toast.success(t("deleteSuccess"));
      onOpenChange(false);
    } catch {
      toast.error(t("deleteError"));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteDescription", { name: clinicName ?? t("thisClinic") })}
          </AlertDialogDescription>
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
