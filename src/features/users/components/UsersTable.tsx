"use client";

import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useGetUsersQuery,
  useToggleUserBlockMutation,
} from "../store/usersApi";
import { getUserFullName } from "../lib/normalize";
import type { UserListItem } from "../types/user";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
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
import { toast } from "sonner";

interface UsersTableProps {
  users: UserListItem[];
  isLoading: boolean;
  isError: boolean;
  canManage: boolean;
  onEdit: (userId: string) => void;
  onDelete: (user: UserListItem) => void;
}

export function UsersTable({
  users,
  isLoading,
  isError,
  canManage,
  onEdit,
  onDelete,
}: UsersTableProps) {
  const t = useTranslations("users");
  const [toggleBlock, { isLoading: isToggling, originalArgs: togglingId }] =
    useToggleUserBlockMutation();
  const togglingUserId =
    isToggling && typeof togglingId === "string" ? togglingId : undefined;

  const handleToggleBlock = async (user: UserListItem) => {
    try {
      await toggleBlock(user.id).unwrap();
      toast.success(
        user.isBlocked ? t("unblockSuccess") : t("blockSuccess"),
      );
    } catch {
      toast.error(t("toggleBlockError"));
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

  if (users.length === 0) {
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
              {t("fullName")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("email")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("phoneNumber")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("role")}
            </TableHead>
            <TableHead scope="col" className="cursor-default text-start">
              {t("accountStatus")}
            </TableHead>
            {canManage ? (
              <TableHead scope="col" className="w-12 cursor-default text-end">
                <span className="sr-only">{t("actions")}</span>
              </TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const fullName = getUserFullName(user);
            const isToggling = togglingUserId === user.id;

            return (
              <TableRow
                key={user.id}
                className={cn(
                  "cursor-default transition-colors hover:bg-muted/40",
                  isToggling && "opacity-60",
                )}
              >
                <TableCell className="font-medium text-popover-foreground">
                  {fullName || "—"}
                </TableCell>
                <TableCell className="min-w-0 text-muted-foreground">
                  <LtrText className="truncate">{user.email}</LtrText>
                </TableCell>
                <TableCell className="min-w-0 text-muted-foreground">
                  <LtrText>{user.phoneNumber}</LtrText>
                </TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  <UserStatusBadge isBlocked={user.isBlocked} />
                </TableCell>
                {canManage ? (
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-popover-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        aria-label={t("openActions", { name: fullName })}
                        disabled={isToggling}
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onEdit(user.id)}
                          >
                            {t("editUserDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={isToggling}
                            onClick={() => handleToggleBlock(user)}
                          >
                            {user.isBlocked
                              ? t("unblockAccount")
                              : t("blockAccount")}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={() => onDelete(user)}
                          >
                            {t("deleteAccount")}
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
