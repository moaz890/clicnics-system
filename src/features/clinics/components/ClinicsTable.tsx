"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  useGetClinicsQuery,
  useUpdateClinicMutation,
} from "../store/clinicsApi";
import type { ClinicListItem } from "../types/clinic";
import { ClinicStatusBadge } from "./ClinicStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ClinicsTableProps {
  onEdit: (clinicId: string) => void;
  onDelete: (clinic: ClinicListItem) => void;
}

export function ClinicsTable({ onEdit, onDelete }: ClinicsTableProps) {
  const t = useTranslations("clinics");
  const { data: clinics = [], isLoading, isError } = useGetClinicsQuery();
  const [updateClinic] = useUpdateClinicMutation();

  const handleToggleActive = async (clinic: ClinicListItem, checked: boolean) => {
    try {
      await updateClinic({
        id: clinic.id,
        body: { isActive: checked },
      }).unwrap();
    } catch {
      /* list refetches via invalidation */
    }
  };

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

  if (clinics.length === 0) {
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
          <TableRow className="hover:bg-transparent">
            <TableHead scope="col" className="text-start">
              {t("name")}
            </TableHead>
            <TableHead scope="col" className="text-start">
              {t("phone")}
            </TableHead>
            <TableHead scope="col" className="text-start">
              {t("examinationFee")}
            </TableHead>
            <TableHead scope="col" className="text-start">
              {t("status")}
            </TableHead>
            <TableHead scope="col" className="w-12 text-end">
              <span className="sr-only">{t("actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics.map((clinic) => (
            <TableRow
              key={clinic.id}
              className={cn("cursor-default transition-colors hover:bg-muted/40")}
            >
              <TableCell className="font-medium text-popover-foreground">
                <Link
                  href={`/dashboard/clinics/${clinic.id}`}
                  className="cursor-pointer text-start hover:text-teal-700 hover:underline"
                >
                  {clinic.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground" dir="ltr">
                {clinic.phone}
              </TableCell>
              <TableCell>
                {t("feeDisplay", { amount: clinic.examinationFee })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={clinic.isActive}
                    onCheckedChange={(checked) =>
                      handleToggleActive(clinic, checked)
                    }
                    className="cursor-pointer data-checked:bg-teal-600"
                    aria-label={
                      clinic.isActive ? t("statusActive") : t("statusInactive")
                    }
                  />
                  <ClinicStatusBadge isActive={clinic.isActive} />
                </div>
              </TableCell>
              <TableCell className="text-end">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-popover-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                    aria-label={t("openActions", { name: clinic.name })}
                  >
                    <MoreHorizontal className="size-4" aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-44">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/clinics/${clinic.id}`}
                            className="cursor-pointer"
                          />
                        }
                      >
                        {t("viewProfile")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(clinic.id)}
                      >
                        {t("editSettings")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => onDelete(clinic)}
                      >
                        {t("deleteClinic")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
