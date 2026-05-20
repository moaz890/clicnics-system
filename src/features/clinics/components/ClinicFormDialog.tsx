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
import type { Clinic } from "../types/clinic";
import { ClinicForm } from "./ClinicForm";

interface ClinicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  clinic?: Clinic;
}

export function ClinicFormDialog({
  open,
  onOpenChange,
  mode,
  clinic,
}: ClinicFormDialogProps) {
  const t = useTranslations("clinics");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border px-6 py-5 text-start">
          <DialogTitle className="text-popover-foreground">
            {mode === "create" ? t("addClinicTitle") : t("editClinicTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create"
              ? t("addClinicDescription")
              : t("editClinicDescription")}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-7rem)]">
          <div className="px-6 py-5">
            <ClinicForm
              key={open ? (mode === "create" ? "create" : (clinic?.id ?? "edit")) : "closed"}
              mode={mode}
              clinic={clinic}
              onSuccess={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
