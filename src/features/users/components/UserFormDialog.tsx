"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User } from "../types/user";
import { UserForm } from "./UserForm";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user?: User;
}

export function UserFormDialog({
  open,
  onOpenChange,
  mode,
  user,
}: UserFormDialogProps) {
  const t = useTranslations("users");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b border-border px-6 py-5 text-start">
          <DialogTitle className="text-popover-foreground">
            {mode === "create" ? t("createAccountTitle") : t("editAccountTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create"
              ? t("createAccountDescription")
              : t("editAccountDescription")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-7rem)]">
          <div className="px-6 py-5">
            <UserForm
              key={
                open
                  ? mode === "create"
                    ? "create"
                    : (user?.id ?? "edit")
                  : "closed"
              }
              mode={mode}
              user={user}
              onSuccess={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
