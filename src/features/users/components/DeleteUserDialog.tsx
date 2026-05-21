"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDeleteUserMutation } from "../store/usersApi";
import { getUserFullName } from "../lib/normalize";
import type { UserListItem } from "../types/user";
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

interface DeleteUserDialogProps {
  user: UserListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const t = useTranslations("users");
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const displayName = user ? getUserFullName(user) : t("thisUser");

  const handleDelete = async () => {
    if (!user) return;
    try {
      await deleteUser(user.id).unwrap();
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
            {user?.role === "patient"
              ? t("deletePatientDescription", { name: displayName })
              : t("deleteDescription", { name: displayName })}
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
